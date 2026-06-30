import fs from 'fs'
import path from 'path'
import { setTimeout as wait } from 'timers/promises'

const root = process.cwd()

const csvPath = path.join(root, 'discogs.csv')
const envPath = path.join(root, '.env')
const coversDir = path.join(root, 'public/covers')
const outputPath = path.join(root, 'src/data/cds.js')

function loadEnv() {
  if (!fs.existsSync(envPath)) return {}

  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  const env = {}

  for (const line of lines) {
    if (!line || line.trim().startsWith('#')) continue

    const [key, ...valueParts] = line.split('=')
    env[key.trim()] = valueParts.join('=').trim()
  }

  return env
}

const env = loadEnv()
const DISCOGS_TOKEN = env.DISCOGS_TOKEN || process.env.DISCOGS_TOKEN

if (!DISCOGS_TOKEN) {
  console.error('Errore: manca DISCOGS_TOKEN nel file .env')
  process.exit(1)
}

function parseCsv(text) {
  const rows = []
  let current = ''
  let row = []
  let insideQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"' && next === '"') {
      current += '"'
      i++
    } else if (char === '"') {
      insideQuotes = !insideQuotes
    } else if (char === ',' && !insideQuotes) {
      row.push(current)
      current = ''
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (current || row.length) {
        row.push(current)
        rows.push(row)
        row = []
        current = ''
      }

      if (char === '\r' && next === '\n') i++
    } else {
      current += char
    }
  }

  if (current || row.length) {
    row.push(current)
    rows.push(row)
  }

  return rows
}

function clean(value) {
  return String(value || '').trim()
}

function cleanLabel(label) {
  return clean(label).split(',')[0].trim()
}

function safeFileName(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\/\\?%*:|"<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getExtensionFromUrl(url) {
  const cleanUrl = url.split('?')[0].toLowerCase()

  if (cleanUrl.endsWith('.png')) return '.png'
  if (cleanUrl.endsWith('.webp')) return '.webp'
  if (cleanUrl.endsWith('.jpeg')) return '.jpg'
  if (cleanUrl.endsWith('.jpg')) return '.jpg'

  return '.jpg'
}

async function fetchDiscogsRelease(releaseId) {
  const response = await fetch(`https://api.discogs.com/releases/${releaseId}`, {
    headers: {
      Authorization: `Discogs token=${DISCOGS_TOKEN}`,
      'User-Agent': 'davide-piano-vue/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`Discogs API ${response.status}`)
  }

  return response.json()
}

async function downloadImage(url, filePath) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'davide-piano-vue/1.0',
    },
  })

  if (!response.ok) {
    throw new Error(`download immagine ${response.status}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  fs.writeFileSync(filePath, buffer)
}

function buildCdFromCsv(row, headers) {
  const item = {}

  headers.forEach((header, index) => {
    item[header] = clean(row[index])
  })

  const releaseId = item.release_id
  const artist = item.Artist
  const title = item.Title
  const year = item.Released
  const labelName = cleanLabel(item.Label)

  return {
    id: releaseId,
    artist,
    title,
    type: 'Album',
    year,
    labelName,
    releaseId,
    cover: '',
    discogsUrl: releaseId ? `https://www.discogs.com/release/${releaseId}` : '',
  }
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error('Errore: non trovo discogs.csv nella cartella principale del progetto')
    process.exit(1)
  }

  fs.mkdirSync(coversDir, { recursive: true })

  const csvText = fs.readFileSync(csvPath, 'utf8')
  const rows = parseCsv(csvText)

  const headers = rows[0]
  const dataRows = rows.slice(1)

  const cds = []

  console.log(`Trovati ${dataRows.length} CD nel CSV.`)
  console.log('Inizio importazione...\n')

  for (let i = 0; i < dataRows.length; i++) {
    const cd = buildCdFromCsv(dataRows[i], headers)

    console.log(`[${i + 1}/${dataRows.length}] ${cd.artist} - ${cd.title}`)

    if (!cd.releaseId) {
      console.log('  ⚠ release_id mancante, salto copertina\n')
      cds.push(cd)
      continue
    }

    try {
      const release = await fetchDiscogsRelease(cd.releaseId)

      if (release.year) {
        cd.year = String(release.year)
      }

      if (release.genres?.length) {
        cd.genre = release.genres.join(', ')
      }

      if (release.styles?.length) {
        cd.style = release.styles.join(', ')
      }

      if (release.formats?.length) {
        cd.type = release.formats[0].descriptions?.[0] || 'Album'
      }

      if (release.tracklist?.length) {
        cd.tracks = release.tracklist
          .filter((track) => track.type_ === 'track')
          .map((track) => ({
            number: track.position,
            title: track.title,
            duration: track.duration || '',
          }))
      }

      const imageUrl = release.images?.[0]?.uri

      if (imageUrl) {
        const extension = getExtensionFromUrl(imageUrl)
        const baseName = safeFileName(`${cd.artist} - ${cd.title}`)
        const fileName = `${baseName}-${cd.releaseId}${extension}`
        const filePath = path.join(coversDir, fileName)

        cd.cover = `/covers/${fileName}`

        if (fs.existsSync(filePath)) {
          console.log('  ✓ copertina già presente\n')
        } else {
          await downloadImage(imageUrl, filePath)
          console.log('  ✓ copertina scaricata\n')
        }
      } else {
        console.log('  ⚠ nessuna copertina trovata\n')
      }

      cds.push(cd)

      await wait(1200)
    } catch (error) {
      console.log(`  ⚠ errore: ${error.message}\n`)
      cds.push(cd)
      await wait(1200)
    }
  }

  const js = `export const cds = ${JSON.stringify(cds, null, 2)}
`

  fs.writeFileSync(outputPath, js)

  console.log('Importazione completata.')
  console.log(`Generato: src/data/cds.js`)
  console.log(`Copertine: public/covers/`)
}

main()
