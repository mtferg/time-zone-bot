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
            >
              <template v-slot:actions>
                <q-btn
                  v-if="!timezone.home"
                  icon="close"
                  color="white"
                  @click="removeTimezone(idx)"
                  flat
                  round
                />
              </template>
            </time-zone>
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
    </div>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 400px">
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
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

// Packages
import moment from 'moment-timezone'

// Components
import TimeZone from 'src/components/TimeZone.vue'

// Mixins
import ColorHelper from 'src/mixins/color-helper.js'
import DateHelper from 'src/mixins/date-helper.js'

// Stores
import TimezoneStorage from 'src/storage/timezone-storage.js'
import ColorStorage from 'src/storage/color-storage.js'

export default defineComponent({
  data () {
    return {
      timezones: [],
      homeTimezone: '',
      loaded: false,

      showAddDialog: false,
      allTimezones: [],
      timezoneOpts: [],
      selectedTimezone: ''
    }
  },

  methods: {
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
        offset: offset - homeOffset
      }

      timezonesCopy.push(newTimezone)
      timezonesCopy.sort((a, b) => a.offset - b.offset)

      this.timezones = timezonesCopy

      TimezoneStorage.setTimezones(this.timezones)
      ColorStorage.setColors(this.colors)
    },

    removeTimezone (idx) {
      const color = this.timezones[idx].color
      this.timezones.splice(idx, 1)
      TimezoneStorage.setTimezones(this.timezones)
      this.releaseColor(color)
      ColorStorage.setColors(this.colors)
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
    }
  },

  computed: {
    timezonesFull () {
      return this.timezones.length >= 10
    }
  },

  mounted () {
    this.loaded = false

    // Get Timezone Options
    this.allTimezones = moment.tz.names()
    this.timezoneOpts = JSON.parse(JSON.stringify(this.allTimezones))

    // Set Colors
    const savedColors = ColorStorage.getColors()
    if (savedColors && savedColors.length > 0) {
      this.colors = savedColors
    }

    // Set Saved Timezones or Add Home
    const savedTimezones = TimezoneStorage.getTimezones()
    if (savedTimezones && savedTimezones.length > 0) {
      this.timezones = savedTimezones
      this.timezones.forEach((timezone) => {
        if (timezone.home) this.homeTimezone = timezone.timezone
      })
    } else {
      const userTimezone = moment.tz.guess()
      this.homeTimezone = userTimezone
      this.pushTimezone(userTimezone, true)
    }

    this.loaded = true
  },

  components: {
    TimeZone
  },

  mixins: [
    ColorHelper,
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
