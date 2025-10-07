<template>
  <q-page
    class="timezone"
    :style="`background-color: ${color}`"
    @mouseover="onHover"
    @mouseleave="offHover"
  >
    <div class="action-btns">
      <q-btn
        v-if="!home && isHovered"
        icon="close"
        color="white"
        @click="removeTimezone"
        flat
        round
      />
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
        <q-btn
          v-show="isHovered"
          class="q-mt-sm"
          color="white"
          icon="palette"
          @click="showColorPicker = !showColorPicker"
          flat
          round
        />
      </div>
      <div
        v-show="showColorPicker && isHovered"
        class="color-picker row items-center justify-center">
        <div v-for="(color, idx) in unusedColors" :key="idx" class="col col-auto q-pa-xs">
          <q-btn
            :style="`background-color: ${color.value}`"
            @click="changeColor(color.value)"
            flat
            round
            dense
          />
        </div>
      </div>
    </div>

    <div class="offset-icon">
      <q-btn
        v-if="home"
        icon="home"
        size="lg"
        color="white"
        flat
        round
        dense
      >
        <q-menu anchor="top middle" self="bottom middle" transition-show="scale">
          <q-item clickable v-ripple @click="refreshHomeTimezone">
            <q-item-section>
              Recalculate Home
            </q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
      <q-btn
        v-else
        :label="friendlyOffset"
        size="lg"
        color="white"
        flat
        round
        dense
      >
        <q-menu anchor="top middle" self="bottom middle" transition-show="scale">
          <q-item clickable v-ripple @click="setHomeTimezone">
            <q-item-section>
              Set as Home
            </q-item-section>
          </q-item>
        </q-menu>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import { getTimeZones } from '@vvo/tzdb'

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
    },
    colorOptions: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      time: null,
      date: null,

      isHovered: false,
      showColorPicker: false
    }
  },

  methods: {
    getDateAndTime () {
      this.time = this.friendlyTime(this.timezone)
      this.date = this.friendlyDate(this.timezone)
    },

    changeColor (colorValue) {
      this.$events.emit('change-color', {
        timezone: this.timezone,
        color: colorValue
      })
    },

    setHomeTimezone () {
      this.$events.emit('set-home-timezone', this.timezone)
    },

    refreshHomeTimezone () {
      this.$events.emit('refresh-home-timezone')
    },

    removeTimezone () {
      this.$events.emit('remove-timezone', this.timezone)
    },

    onHover () {
      this.isHovered = true
    },

    offHover () {
      this.isHovered = false
      this.showColorPicker = false
    }
  },

  computed: {
    friendlyOffset () {
      return this.offset > 0 ? `+${this.offset}` : this.offset
    },
    friendlyTimezone () {
      const tzs = getTimeZones()
      const tz = tzs.find((t) => t.name === this.timezone || (t.group && t.group.includes(this.timezone)))
      if (!tz) return this.timezone
      const alt = tz.alternativeName || tz.name
      const city = (tz.mainCities && tz.mainCities.length > 0) ? tz.mainCities[0] : tz.countryName
      return `${alt} (${city})`
    },
    unusedColors () {
      return this.colorOptions.filter(color => !color.used)
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
</style>
