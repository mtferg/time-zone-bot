<template>
  <q-page class="bg-dark">
    <div v-if="!loaded" class="loader">
      <q-spinner-grid size="200px" color="secondary" />
    </div>
    <div v-else>
      <q-scroll-area style="height: 100vh; width: 100vw;">
        <div class="row no-wrap">
          <div v-for="(timezone, idx) in timezones" :key="idx" class="col">
            <time-zone
              :color="timezone.color"
              :timezone="timezone.timezone"
              :home="timezone.home"
              :offset="timezone.offset"
              :color-options="colors"
            />
          </div>
        </div>
      </q-scroll-area>

      <q-page-sticky position="bottom-right" :offset="[20, 20]">
        <q-btn
          icon="add"
          color="secondary"
          @click="showAddDialog = true"
          :disabled="timezonesFull"
          fab
        />
      </q-page-sticky>
      <q-page-sticky position="top-right" :offset="[20, 20]">
        <q-btn
          icon="help"
          size="lg"
          color="blue-grey-1"
          @click="showHelpDialog = true"
          flat
          round
          dense
          fab
        />
      </q-page-sticky>
    </div>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card class="q-px-sm" style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Add Location</div>
          <q-space />
          <q-btn icon="close" @click="closeAddDialog" flat round dense />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-select
            v-model="selectedTimezone"
            input-debounce="0"
            label="Time Zone"
            :options="timezoneOpts"
            @filter="filterTimezones"
            use-input
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="+ Add Time Zone"
            color="primary"
            @click="addTimezone"
            :disable="!selectedTimezone"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showHelpDialog">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h4">v{{ appVersion }}</div>
          <q-space />
          <q-btn icon="close" @click="showHelpDialog = false" flat round dense />
        </q-card-section>

        <q-card-section class="text-body1 q-my-sm">
          <div>
            <span class="text-weight-bold">Author: </span>
            <span>Michael Ferguson</span>
          </div>
          <div class="q-mt-xs">
            <span class="text-weight-bold">Contact: </span>
            <a href="mailto:michaeltferg@gmail.com">michaeltferg@gmail.com</a>
            <span> &bull; </span>
            <a href="https://www.linkedin.com/in/mtferg/" target="_blank">linkedin.com/in/mtferg</a>
          </div>
          <div class="q-mt-lg">
            This is a free project inspired by FIO which shut down in Oct. 2024. Please contact author (Michael Ferguson) for any inquiries or feature requests.
          </div>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn
            icon="clear"
            label="Reset Time Zone Data"
            color="negative"
            @click="resetData"
            flat
          />
          <q-space />
          <q-btn
            icon="rocket_launch"
            label="Get Lost"
            color="light-blue-2"
            to="/lost-in-space"
            flat
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

// Packages
import moment from 'moment-timezone'

// Components
import TimeZone from 'src/components/TimeZone.vue'

// Mixins
import DateHelper from 'src/mixins/date-helper.js'

// Stores
import TimezoneStorage from 'src/storage/timezone-storage.js'
import ColorStorage from 'src/storage/color-storage.js'

export default defineComponent({
  data () {
    return {
      appVersion: '2.0.0',
      loaded: false,

      // Timezone Info
      timezones: [],
      homeTimezone: '',

      // Adding Timezones
      allTimezones: [],
      timezoneOpts: [],
      selectedTimezone: '',

      // Colors
      deafultColor: '#0D0A0B',
      colors: [
        { used: false, value: '#D8B4A0' },
        { used: false, value: '#F0B67F' },
        { used: false, value: '#C69C72' },
        { used: false, value: '#D8973C' },
        { used: false, value: '#BD632F' },
        { used: false, value: '#C0B7B1' },
        { used: false, value: '#AEB4A9' },
        { used: false, value: '#95AFBA' },
        { used: false, value: '#326273' },
        { used: false, value: '#274156' },
        { used: false, value: '#6A8E7F' },
        { used: false, value: '#808F85' },
        { used: false, value: '#08605F' },
        { used: false, value: '#D89A9E' },
        { used: false, value: '#846267' },
        { used: false, value: '#655A7C' },
        { used: false, value: '#5F6062' },
        { used: false, value: '#575761' },
        { used: false, value: '#433E3F' },
        { used: false, value: '#223843' }
      ],

      // Dialogs
      showAddDialog: false,
      showHelpDialog: false
    }
  },

  methods: {
    // Setup
    setupData () {
      this.loaded = false
      this.getTimezoneOptions()
      this.reconcileTimezones()
      this.reconcileColors()
      this.loaded = true
    },

    resetData () {
      // Reset Local Data
      this.timezones = []
      this.colors.forEach((_color, idx) => { this.colors[idx].used = false })
      this.homeTimezone = ''

      // Reset Storage
      TimezoneStorage.setTimezones(this.timezones)
      ColorStorage.setColors(this.colors)

      // Reset Data
      this.setupData()

      // Close Help Dialog
      this.showHelpDialog = false
    },

    // --- Setting Data ---
    // Get time zone options
    getTimezoneOptions () {
      this.allTimezones = moment.tz.names()
      this.timezoneOpts = JSON.parse(JSON.stringify(this.allTimezones))
    },

    // Sets the given time zone as the new home
    setHomeTimezone (timezone) {
      this.homeTimezone = timezone
      const homeOffset = this.timezoneOffset(timezone)
      let foundTimezone = false

      // Set home flag and readjust offsets
      this.timezones.forEach((tz) => {
        const offset = this.timezoneOffset(tz.timezone)
        tz.offset = offset - homeOffset
        if (tz.timezone === timezone) {
          tz.home = true
          foundTimezone = true
        } else {
          tz.home = false
        }
      })

      // Add timezone if it doesn't already exist
      if (!foundTimezone) {
        this.pushTimezone(timezone, true)
      }

      // Re-sort timezones
      this.timezones.sort((a, b) => a.offset - b.offset)

      // Save time zone changes
      TimezoneStorage.setTimezones(this.timezones)
    },

    refreshHomeTimezone () {
      const userTimezone = moment.tz.guess()
      this.setHomeTimezone(userTimezone)
    },

    // Reconcile time zone information
    reconcileTimezones () {
      // Get saved timezones
      const savedTimezones = TimezoneStorage.getTimezones()

      if (savedTimezones && savedTimezones.length > 0) {
        // Import saved time zones
        savedTimezones.forEach((tz) => {
          this.timezones.push({
            timezone: tz.timezone,
            color: tz.color,
            home: tz.home,
            offset: tz.offset,
            label: tz.label || ''
          })
          if (tz.home) this.homeTimezone = tz.timezone
        })
      } else {
        // Add home timezone
        const userTimezone = moment.tz.guess()
        this.homeTimezone = userTimezone
        this.pushTimezone(userTimezone, true)
      }
    },

    // Reconcile color information
    reconcileColors () {
      // Get saved colors
      const savedColors = ColorStorage.getColors()

      // Set used colors
      if (savedColors && savedColors.length > 0) {
        this.colors.forEach((color, idx) => {
          const savedColor = savedColors.find((c) => c.value === color.value)
          if (savedColor) this.colors[idx].used = savedColor.used
        })
      }

      // Save colors
      ColorStorage.setColors(this.colors)
    },

    // --- Adding / Remvoing Time Zones ---
    addTimezone () {
      if (!this.selectedTimezone) return
      this.pushTimezone(this.selectedTimezone)
      this.selectedTimezone = ''
    },

    pushTimezone (timezone, home = false) {
      const timezonesCopy = JSON.parse(JSON.stringify(this.timezones))
      const homeOffset = this.timezoneOffset(this.homeTimezone)
      const offset = this.timezoneOffset(timezone)

      const newTimezone = {
        color: this.newColor(),
        timezone: timezone,
        home: home,
        offset: offset - homeOffset,
        label: ''
      }

      timezonesCopy.push(newTimezone)
      timezonesCopy.sort((a, b) => a.offset - b.offset)

      this.timezones = timezonesCopy

      TimezoneStorage.setTimezones(this.timezones)
      ColorStorage.setColors(this.colors)
    },

    removeTimezone (timezone) {
      // Find Timezone
      const idx = this.timezones.findIndex((tz) => tz.timezone === timezone)
      if (idx < 0) return

      // Release Color
      const color = this.timezones[idx].color
      this.releaseColor(color)
      ColorStorage.setColors(this.colors)

      // Remove Timezone
      this.timezones.splice(idx, 1)
      TimezoneStorage.setTimezones(this.timezones)
    },

    closeAddDialog () {
      this.showAddDialog = false
      this.selectedTimezone = ''
    },

    filterTimezones (val, update) {
      if (val === '') {
        update(() => {
          this.timezoneOpts = JSON.parse(JSON.stringify(this.allTimezones))
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.timezoneOpts = this.allTimezones.filter((v) => v.toLowerCase().indexOf(needle) > -1)
      })
    },

    // --- Color Functionality ---
    newColor () {
      const availableColors = this.colors.filter(color => !color.used)
      if (availableColors.length === 0) {
        return this.deafultColor
      }

      const color = availableColors[Math.floor(Math.random() * availableColors.length)]
      color.used = true
      return color.value
    },

    releaseColor (color) {
      const foundColor = this.colors.find((c) => c.value === color)
      if (foundColor) foundColor.used = false
    },

    changeColor (data) {
      // Find Timezone
      const foundTimezone = this.timezones.find((timezone) => timezone.timezone === data.timezone)
      if (!foundTimezone) return

      this.releaseColor(foundTimezone.color) // Release old color
      foundTimezone.color = data.color // Update Color

      // Set new color as used
      const newColor = this.colors.find((color) => color.value === data.color)
      if (newColor) newColor.used = true

      // Save Color and Timezone Changes
      ColorStorage.setColors(this.colors)
      TimezoneStorage.setTimezones(this.timezones)
    }
  },

  computed: {
    timezonesFull () {
      return this.timezones.length >= 20
    }
  },

  mounted () {
    this.setupData()

    // Event Listeners
    this.$events.on('change-color', (data) => {
      this.changeColor(data)
    })
    this.$events.on('remove-timezone', (timezone) => {
      this.removeTimezone(timezone)
    })
    this.$events.on('set-home-timezone', (timezone) => {
      this.setHomeTimezone(timezone)
    })
    this.$events.on('refresh-home-timezone', () => {
      this.refreshHomeTimezone()
    })
  },

  beforeUnmount () {
    this.$events.off('change-color')
    this.$events.off('set-home-timezone')
    this.$events.off('remove-timezone')
  },

  components: {
    TimeZone
  },

  mixins: [
    DateHelper
  ]
})
</script>

<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: $dark;
}
</style>
