// Time Override Storage

class TimeOverrideStorage {
  setOverride (override) {
    localStorage.tbzTimeOverride = JSON.stringify(override)
  }

  getOverride () {
    return JSON.parse(localStorage.tbzTimeOverride || 'null')
  }

  clearOverride () {
    delete localStorage.tbzTimeOverride
  }
}

const timeOverrideStorage = new TimeOverrideStorage()
export default timeOverrideStorage

