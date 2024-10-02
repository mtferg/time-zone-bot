<template>
  <q-page class="timezone" :style="`background-color: ${color}`">
    <div class="text-h3 q-mb-md">
      {{ time }}
    </div>
    <div class="text-h5 q-mb-md">
      {{ date }}
    </div>
    <q-separator size="3px" style="max-width: 80%; margin: 0 auto;" />
    <div class="text-h6 q-mt-md">
      {{ timezone }}
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

// Helpers
import DateHelper from 'src/mixins/date-helper.js'

export default defineComponent({
  props: {
    color: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      time: null,
      date: null
    }
  },

  mounted () {
    this.time = this.friendlyTime(this.timezone)
    this.date = this.friendlyDate(this.timezone)
  },

  mixins: [
    DateHelper
  ]
})
</script>

<style lang="scss">
.timezone {
  height: 100vh;
  width: 100%;
  min-width: 300px;
  padding-top: 40vh;
  text-align: center;
}
</style>
