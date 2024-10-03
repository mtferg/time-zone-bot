// Timezone Storage

class TimezoneStorage {
  setTimezones (timezones) {
    localStorage.tbzTimezones = JSON.stringify(timezones)
  }

  getTimezones () {
    return JSON.parse(localStorage.tbzTimezones || '[]')
  }
}

const timezoneStorage = new TimezoneStorage()
export default timezoneStorage
