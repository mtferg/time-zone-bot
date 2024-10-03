<template>
  <q-page class="timezone" :style="`background-color: ${color}`">
    <div class="action-btns">
      <slot name="actions" />
    </div>
    <div class="timezone-info text-white">
      <div class="text-h3 text-white q-mb-md">
        {{ time }}
      </div>
      <div class="text-h5 q-mb-md">
        {{ date }}
      </div>
      <q-separator size="3px" style="max-width: 80%; margin: 0 auto;" />
      <div class="text-h6 q-mt-md">
        {{ timezone }}
      </div>
    </div>

    <div class="offset-icon">
      <q-icon v-if="home" name="home" size="30px" color="white" />
      <div v-else class="text-h6 text-white">
        {{ friendlyOffset }}
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

// Helpers
import DateHelper from 'src/mixins/date-helper.js'
import RefreshHelper from 'src/mixins/refresh-helper.js'

export default defineComponent({
  props: {
    timezone: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    home: {
      type: Boolean,
      default: false
    },
    offset: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      time: null,
      date: null
    }
  },

  methods: {
    getDateAndTime () {
      this.time = this.friendlyTime(this.timezone)
      this.date = this.friendlyDate(this.timezone)
    }
  },

  computed: {
    friendlyOffset () {
      return this.offset > 0 ? `+${this.offset}` : this.offset
    }
  },

  watch: {
    timezone () {
      this.getDateAndTime()
    }
  },

  mounted () {
    this.getDateAndTime()
    this.startRefresh(this.getDateAndTime)
  },

  beforeUnmount () {
    this.stopRefresh()
  },

  mixins: [
    DateHelper,
    RefreshHelper
  ]
})
</script>

<style lang="scss">
.timezone {
  position: relative;
  height: 100vh;
  width: 100%;
  min-width: 300px;
  padding-top: 40vh;
  text-align: center;
}

.offset-icon {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
}

.action-btns {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
