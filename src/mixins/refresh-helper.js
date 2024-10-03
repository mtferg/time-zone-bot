// Helpers to refresh content

export default {
  data () {
    return {
      refreshTimer: null
    }
  },

  methods: {
    startRefresh (fn, params = [], refreshInterval = 5000) {
      fn(...params)
      this.refreshTimer = setTimeout(() => {
        this.startRefresh(fn, params, refreshInterval)
      }, refreshInterval)
    },

    stopRefresh () {
      if (!this.refreshTimer) return
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }
  }
}
