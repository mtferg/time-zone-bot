// Color Storage

class ColorStorage {
  setColors (colors) {
    localStorage.tzbColors = JSON.stringify(colors)
  }

  getColors () {
    return JSON.parse(localStorage.tzbColors || '[]')
  }
}

const colorStorage = new ColorStorage()
export default colorStorage
