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
    }
  }
}
