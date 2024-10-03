// Color Storage

class ColorStorage {
  setColors (colors) {
    localStorage.tzbColors = JSON.stringify(colors)
  }

  getColors () {
    return JSON.parse(localStorage.tzbColors || '[]')
    // colors.forEach((color, idx) => {
    //   colors[idx].used = color.used === 'true'
    // })
    // return colors
  }
}

const colorStorage = new ColorStorage()
export default colorStorage
