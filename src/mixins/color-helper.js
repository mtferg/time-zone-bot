// Functions to help format and transform dates

export default {
  data () {
    return {
      colors: [
        { used: false, value: '#5C6D70' },
        { used: false, value: '#D8973C' },
        { used: false, value: '#BD632F' },
        { used: false, value: '#95AFBA' },
        { used: false, value: '#F0B67F' },
        { used: false, value: '#6A8E7F' },
        { used: false, value: '#808F85' },
        { used: false, value: '#326273' }
      ]
    }
  },

  methods: {
    newColor () {
      const availableColors = this.colors.filter(color => !color.used)
      if (availableColors.length === 0) {
        return null
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
