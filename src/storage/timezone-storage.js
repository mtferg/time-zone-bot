// Timezone Storage

class TimezoneStorage {
  setTimezones (timezones) {
    localStorage.tbzTimezones = JSON.stringify(timezones)
  }

  getTimezones () {
    return JSON.parse(localStorage.tbzTimezones || '[]')
    // timezones.forEach((timezone, idx) => {
    //   console.log('OFFSET IS: ' + typeof timezone.offset)
    //   timezones[idx].offset = parseInt(timezone.offset)
    //   console.log('HOME IS: ' + typeof timezone.home)
    //   timezones[idx].home = timezone.home === 'true'
    // })
    // return timezones
  }
}

const timezoneStorage = new TimezoneStorage()
export default timezoneStorage
