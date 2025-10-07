
<template>
  <q-layout view="hHh lpR fFf">

    <!-- <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/logo.png">
          </q-avatar>
          Time Zone Bot
        </q-toolbar-title>
      </q-toolbar>
    </q-header> -->

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Buy Me a Coffee button (fixed top-right) -->
    <div class="bmc-button-fixed">
      <a href="https://www.buymeacoffee.com/mtferg" target="_blank" rel="noopener">
        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" />
      </a>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data () {
    return {

    }
  }
})
</script>

<style scoped>
.bmc-button-fixed {
  position: fixed;
  top: 75px;
  right: 20px;
  z-index: 2000;
}

.bmc-button-fixed img {
  height: 50px !important;
  width: 180px !important;
}

@media (max-width: 480px) {
  .bmc-button-fixed img {
    height: 40px !important;
    width: 150px !important;
  }
}
</style>
