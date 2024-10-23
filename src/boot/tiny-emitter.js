// src/boot/tiny-emitter.js

import { boot } from 'quasar/wrappers'
import emitter from 'tiny-emitter/instance'

export default boot(({ app }) => {
  app.config.globalProperties.$events = emitter
})
