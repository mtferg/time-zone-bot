// Functions to help format and transform dates

export default {
  data () {
    return {
      deafultColor: '#0D0A0B',
      colors: [
        { value: '#F6D7A4', text: 'black' },  // 6 AM - Pastel Orange
        { value: '#F8E0A5', text: 'black' },  // 7 AM - Light Yellow
        { value: '#F4B77A', text: 'black' },  // 8 AM - Soft Apricot
        { value: '#C5E1DC', text: 'black' },  // 9 AM - Pastel Aqua
        { value: '#A9CFD8', text: 'black' },  // 10 AM - Pale Sky Blue
        { value: '#D5E9D4', text: 'black' },  // 11 AM - Pastel Green
        { value: '#92BCC3', text: 'black' },  // 12 PM - Light Teal
        { value: '#C2E4D0', text: 'black' },  // 1 PM - Light Seafoam
        { value: '#E09C5F', text: 'black' },  // 2 PM - Burnt Orange
        { value: '#DBA55D', text: 'black' },  // 3 PM - Warm Amber
        { value: '#E0A36F', text: 'black' },  // 4 PM - Deep Peach
        { value: '#E1B173', text: 'black' },  // 5 PM - Muted Gold
        { value: '#E1A25D', text: 'black' },  // 6 PM - Golden Honey
        { value: '#D98B4A', text: 'black' },  // 7 PM - Rust Orange
        { value: '#C37840', text: 'black' },  // 8 PM - Earthy Orange
        { value: '#D1814B', text: 'black' },  // 9 PM - Golden Brown
        { value: '#4C6F6B', text: 'white' },  // 10 PM - Deep Teal
        { value: '#5C737E', text: 'white' },  // 11 PM - Slate Blue
        { value: '#3D3A58', text: 'white' },  // 12 AM - Dark Purple
        { value: '#2E1E33', text: 'white' },  // 1 AM - Deep Plum
        { value: '#3A5052', text: 'white' },  // 2 AM - Charcoal Teal
        { value: '#2E3F44', text: 'white' },  // 3 AM - Dark Charcoal
        { value: '#394B59', text: 'white' },  // 4 AM - Deep Ocean Slate
        { value: '#3B6A73', text: 'white' }   // 5 AM - Deep Ocean Blue
      ],
      // colors: [
      //   { used: false, value: '#5C6D70' },
      //   { used: false, value: '#D8973C' },
      //   { used: false, value: '#BD632F' },
      //   { used: false, value: '#95AFBA' },
      //   { used: false, value: '#F0B67F' },
      //   { used: false, value: '#6A8E7F' },
      //   { used: false, value: '#808F85' },
      //   { used: false, value: '#326273' },
      //   { used: false, value: '#846267' },
      //   { used: false, value: '#5F6062' }
      // ],
      // dawnColors: [
      //   { used: false, value: '#F4D35E' },  // Pastel Orange
      //   { used: false, value: '#F8E0A5' },  // Light Yellow
      //   { used: false, value: '#F4A672' },  // Soft Apricot
      //   { used: false, value: '#F1C48F' },  // Pale Sand
      //   { used: false, value: '#F8D6B2' },  // Muted Peach
      // ],
      // dayColors: [
      //   { used: false, value: '#C5E1DC' },  // Pastel Aqua
      //   { used: false, value: '#A9CFD8' },  // Pale Sky Blue
      //   { used: false, value: '#D5E9D4' },  // Pastel Green
      //   { used: false, value: '#92BCC3' },  // Light Teal
      //   { used: false, value: '#C2E4D0' },  // Light Seafoam
      // ],
      // duskColors: [
      //   { used: false, value: '#F0B67F' },  // Burnt Orange
      //   { used: false, value: '#D98B4A' },  // Rust Orange
      //   { used: false, value: '#D8973C' },  // Warm Amber
      //   { used: false, value: '#C37840' },  // Earthy Orange
      //   { used: false, value: '#BD632F' },  // Golden Honey
      // ],
      // nightColors: [
      //   { used: false, value: '#4C6F6B' },  // Deep Teal
      //   { used: false, value: '#3A5052' },  // Charcoal Teal
      //   { used: false, value: '#5C737E' },  // Slate Blue
      //   { used: false, value: '#3D3A58' },  // Dark Purple
      //   { used: false, value: '#2E1E33' },  // Deep Plum
      // ]
    }
  },

  methods: {
    newColor () {
      const availableColors = this.colors.filter(color => !color.used)
      if (availableColors.length === 0) {
        return this.deafultColor
      }

      const color = availableColors[Math.floor(Math.random() * availableColors.length)]
      color.used = true
      return color.value
    },

    releaseColor (color) {
      const foundColor = this.colors.find((c) => c.value === color)
      if (foundColor) foundColor.used = false
    }
  }
}
