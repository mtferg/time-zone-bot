class TimeFormatStorage {
  getFormat () {
    return localStorage.tzbTimeFormat || '12'
  }

  setFormat (format) {
    localStorage.tzbTimeFormat = format
  }
}

const timeFormatStorage = new TimeFormatStorage()
export default timeFormatStorage
