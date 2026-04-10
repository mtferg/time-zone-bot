<template>
  <q-page class="timezone" :style="`background-color: ${color}`" @mouseover="onHover" @mouseleave="offHover">
    <div class="action-btns">
      <q-btn v-if="!home && isHovered" icon="close" color="white" @click="removeTimezone" flat round />
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
        {{ friendlyTimezone }}
      </div>
      <div>
        <q-btn v-show="isHovered" class="q-mt-sm" color="white" icon="palette"
          @click="showColorPicker = !showColorPicker" flat round />
      </div>
      <div v-show="showColorPicker && isHovered" class="color-picker row items-center justify-center">
        <div v-for="(color, idx) in unusedColors" :key="idx" class="col col-auto q-pa-xs">
          <q-btn :style="`background-color: ${color.value}`" @click="changeColor(color.value)" flat round dense />
        </div>
      </div>
    </div>

    <div class="offset-icon">
      <q-btn v-if="home" icon="home" size="lg" color="white" flat round dense>
        <q-menu anchor="top middle" self="bottom middle" transition-show="scale">
          <q-item clickable v-ripple @click="refreshHomeTimezone">
            <q-item-section>
              Recalculate Home
            </q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
      <q-btn v-else :label="friendlyOffset" size="lg" color="white" flat round dense>
        <q-menu anchor="top middle" self="bottom middle" transition-show="scale">
          <q-item clickable v-ripple @click="setHomeTimezone">
            <q-item-section>
              Set as Home
            </q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </div>

    <!-- Time Override Section - Bottom of card -->
    <div class="time-override-bottom">
      <!-- Show override time on all cards when active -->
      <div v-if="hasOverride" class="override-time-display text-white">
        <div class="text-h5">{{ overrideTime }}</div>
        <div class="text-caption">{{ overrideDate }}</div>
        <q-btn class="q-mt-xs" label="Clear Time" icon="clear" color="white" @click="clearOverrideTime" flat dense
          size="sm" />
      </div>

      <!-- Show input only on hover when no override is active -->
      <div v-if="!hasOverride && isHovered" class="time-input-section">
        <q-input v-model="timeInput" class="time-override-input" label="Check time"
          :mask="use24hr ? '##:##' : '##:##aa'" :placeholder="use24hr ? '15:00' : '03:00pm'"
          dark outlined dense bg-color="rgba(255, 255, 255, 0.1)" label-color="white" color="white"
          @keyup.enter="setOverrideTime">
          <template v-slot:append>
            <q-icon name="schedule" color="white" />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { getTimeZones } from '@vvo/tzdb'

// Helpers
import DateHelper from 'src/mixins/date-helper.js'
import RefreshHelper from 'src/mixins/refresh-helper.js'

// Storage
import TimeOverrideStorage from 'src/storage/time-override-storage.js'

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
    },
    colorOptions: {
      type: Array,
      required: true
    },
    use24hr: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      time: null,
      date: null,

      isHovered: false,
      showColorPicker: false,

      // Time override
      timeInput: '',
      hasOverride: false,
      isSourceTimezone: false,
      overrideTime: null,
      overrideDate: null
    }
  },

  methods: {
    getDateAndTime() {
      // Always show current time in main display
      this.time = this.friendlyTime(this.timezone, undefined, this.use24hr)
      this.date = this.friendlyDate(this.timezone)

      // Check if there's an active override
      const override = TimeOverrideStorage.getOverride()

      if (override && override.sourceTimezone && override.time) {
        this.hasOverride = true
        this.isSourceTimezone = (override.sourceTimezone === this.timezone)

        // Calculate and show override time for ALL cards (including source)
        const converted = this.convertTimeToTimezone(
          override.sourceTimezone,
          override.time,
          this.timezone,
          this.use24hr
        )
        if (converted) {
          this.overrideTime = converted.time
          this.overrideDate = converted.date
        }
      } else {
        // No override
        this.hasOverride = false
        this.isSourceTimezone = false
        this.overrideTime = null
        this.overrideDate = null
      }
    },

    setOverrideTime() {
      // Validate time input
      const minLen = this.use24hr ? 5 : 7
      if (!this.timeInput || this.timeInput.length < minLen) {
        return
      }

      // Emit event to set override time
      this.$events.emit('set-override-time', {
        timezone: this.timezone,
        time: this.timeInput
      })

      // Clear input
      this.timeInput = ''
    },

    clearOverrideTime() {
      this.$events.emit('clear-override-time')
    },

    changeColor(colorValue) {
      this.$events.emit('change-color', {
        timezone: this.timezone,
        color: colorValue
      })
    },

    setHomeTimezone() {
      this.$events.emit('set-home-timezone', this.timezone)
    },

    refreshHomeTimezone() {
      this.$events.emit('refresh-home-timezone')
    },

    removeTimezone() {
      this.$events.emit('remove-timezone', this.timezone)
    },

    onHover() {
      this.isHovered = true
    },

    offHover() {
      this.isHovered = false
      this.showColorPicker = false
    }
  },

  computed: {
    friendlyOffset() {
      return this.offset > 0 ? `+${this.offset}` : this.offset
    },
    friendlyTimezone() {
      const tzs = getTimeZones()
      const tz = tzs.find((t) => t.name === this.timezone || (t.group && t.group.includes(this.timezone)))
      if (!tz) return this.timezone
      const alt = tz.alternativeName || tz.name
      const city = (tz.mainCities && tz.mainCities.length > 0) ? tz.mainCities[0] : tz.countryName
      return `${alt} (${city})`
    },
    unusedColors() {
      return this.colorOptions.filter(color => !color.used)
    }
  },

  watch: {
    timezone() {
      this.getDateAndTime()
    },
    use24hr() {
      this.timeInput = ''
      this.getDateAndTime()
    }
  },

  mounted() {
    this.getDateAndTime()
    // Always start auto-refresh for main time
    this.startRefresh(this.getDateAndTime)

    // Listen for override events
    this.$events.on('override-time-updated', () => {
      this.getDateAndTime()
    })

    this.$events.on('time-format-changed', () => {
      this.getDateAndTime()
    })

    this.$events.on('override-time-cleared', () => {
      this.hasOverride = false
      this.isSourceTimezone = false
      this.overrideTime = null
      this.overrideDate = null
      this.getDateAndTime()
    })
  },

  beforeUnmount() {
    this.stopRefresh()
    this.$events.off('time-format-changed')
    this.$events.off('override-time-updated')
    this.$events.off('override-time-cleared')
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
  bottom: 5px;
  left: 50%;
  transform: translateX(-50%);
}

.action-btns {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
}

.color-picker {
  max-width: 350px;
  margin: 0 auto;
}

.time-override-bottom {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 250px;
  text-align: center;
}

.override-time-display {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
}

.time-input-section {
  padding: 10px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.time-override-input {
  margin: 0 auto;
}
</style>
