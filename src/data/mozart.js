const BASE_URL = import.meta.env.BASE_URL

export const mozartSections = [
  {
    id: 'mozart-k545',
    title: 'Sonata facile K545',
    pieces: [
      {
        id: 'mozart-k545-1',
        title: 'K545 — I movimento',
        subtitle: 'Allegro',
        duration: '—',
        midi: {
          full: '',
          right: '',
          left: '',
        },
      },
      {
        id: 'mozart-k545-2',
        title: 'K545 — II movimento',
        subtitle: 'Andante',
        duration: '5:11',
        midi: {
          full: `${BASE_URL}midi/Mozart_K545_2nd_movimento.mid`,
          right: '',
          left: '',
        },
      },
      {
        id: 'mozart-k545-3',
        title: 'K545 — III movimento',
        subtitle: 'Rondo',
        duration: '—',
        midi: {
          full: '',
          right: '',
          left: '',
        },
      },
    ],
  },
  {
    id: 'mozart-k331',
    title: 'Sonata K331',
    pieces: [
      {
        id: 'mozart-k331-1',
        title: 'K331 — I movimento',
        subtitle: 'Tema con variazioni',
        duration: '—',
        midi: {
          full: '',
          right: '',
          left: '',
        },
      },
      {
        id: 'mozart-k331-3',
        title: 'K331 — III movimento',
        subtitle: 'Alla Turca',
        duration: '—',
        midi: {
          full: '',
          right: '',
          left: '',
        },
      },
    ],
  },
]
