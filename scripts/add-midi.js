import fs from 'fs'
import path from 'path'

const fileName = process.argv[2]
const title = process.argv[3]

if (!fileName || !title) {
  console.log('Uso: node scripts/add-midi.js nomefile.mid "Titolo brano"')
  process.exit()
}

const sourcePath = path.join(process.cwd(), fileName)
const destDir = path.join(process.cwd(), 'public', 'midi')
const destPath = path.join(destDir, path.basename(fileName))

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true })
}

fs.copyFileSync(sourcePath, destPath)

console.log('Copiato in public/midi/' + path.basename(fileName))
console.log('Ora aggiungi questo nel tuo mozart.js:')

console.log(`
{
  id: '${path.basename(fileName, '.mid')}',
  title: '${title}',
  midi: BASE_URL + 'midi/${path.basename(fileName)}'
}
`)
