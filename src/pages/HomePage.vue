<template>
  <q-page>
    <q-scroll-area style="height: 100vh; width: 100vw;">
      <div class="row no-wrap">
        <div v-for="(timezone, idx) in timezones" :key="idx" class="col">
          <time-zone :color="timezone.color" :timezone="timezone.timezone" />
        </div>
      </div>
    </q-scroll-area>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn icon="add" color="secondary" @click="showAddDialog = true" fab />
    </q-page-sticky>

    <q-dialog v-model="showAddDialog" persistent>
      <q-card style="min-width: 350px">
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

        <q-card-actions align="right" class="text-primary">
          <q-btn label="Add" @click="addTimezone" flat v-close-popup />
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

export default defineComponent({
  data () {
    return {
      timezones: [],

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

    pushTimezone (timezone) {
      this.timezones.push({
        color: this.newColor(),
        timezone: timezone
      })
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

  mounted () {
    // Get Timezone Options
    this.allTimezones = moment.tz.names()
    this.timezoneOpts = JSON.parse(JSON.stringify(this.allTimezones))

    // Add User Timezone
    const userTimezone = moment.tz.guess()
    this.pushTimezone(userTimezone)
  },

  components: {
    TimeZone
  },

  mixins: [
    ColorHelper
  ]
})
</script>
