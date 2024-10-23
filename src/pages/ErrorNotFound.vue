<template>
  <div class="fullscreen bg-image text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="text-white" style="font-size: 30vh">
        404
      </div>

      <div class="text-h2 text-white" style="opacity:.75">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        :icon="btnIcon"
        color="amber-10"
        text-color="white"
        unelevated
        to="/"
        label="Route Back Home"
        @mouseover="btnIcon = 'rocket_launch'"
        @mouseleave="btnIcon = 'rocket'"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',

  data () {
    return {
      btnIcon: 'rocket'
    }
  }
})
</script>

<style scoped>
.bg-image {
  background-image: url('/404-background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
