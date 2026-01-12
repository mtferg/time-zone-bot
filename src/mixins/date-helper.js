// Functions to help format and transform dates

import moment from 'moment-timezone'

export default {
  methods: {
    friendlyTime (timezone, date) {
      return moment.tz(date, timezone).format('h:mm a')
    },

    friendlyDate (timezone, date) {
      return moment.tz(date, timezone).format('MMM. Do')
    },

    timezoneOffset (timezone, date) {
      return moment.tz(date, timezone).utcOffset() / 60
    },

    convertTimeToTimezone (sourceTimezone, sourceTime, targetTimezone) {
      // Parse the time string (e.g., "3:00pm" or "03:00pm")
      // Create a moment in the source timezone for today at that time
      const parsedTime = moment.tz(sourceTime, 'h:mma', sourceTimezone)

      // If parsing fails, try alternative format
      if (!parsedTime.isValid()) {
        return null
      }

      // Convert to target timezone
      const targetTime = parsedTime.clone().tz(targetTimezone)

      return {
        time: targetTime.format('h:mm a'),
        date: targetTime.format('MMM. Do')
      }
    }
  }
}
