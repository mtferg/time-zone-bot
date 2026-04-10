// Functions to help format and transform dates

import moment from 'moment-timezone'

export default {
  methods: {
    friendlyTime (timezone, date, use24hr) {
      const fmt = use24hr ? 'HH:mm' : 'h:mm a'
      return moment.tz(date, timezone).format(fmt)
    },

    friendlyDate (timezone, date) {
      return moment.tz(date, timezone).format('MMM. Do')
    },

    timezoneOffset (timezone, date) {
      return moment.tz(date, timezone).utcOffset() / 60
    },

    convertTimeToTimezone (sourceTimezone, sourceTime, targetTimezone, use24hr) {
      const parsedTime = moment.tz(sourceTime, ['h:mma', 'HH:mm'], sourceTimezone)

      if (!parsedTime.isValid()) {
        return null
      }

      const targetTime = parsedTime.clone().tz(targetTimezone)
      const fmt = use24hr ? 'HH:mm' : 'h:mm a'

      return {
        time: targetTime.format(fmt),
        date: targetTime.format('MMM. Do')
      }
    }
  }
}
