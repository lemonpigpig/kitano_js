import Vue from 'vue'

if (process.BROWSER_BUILD) {
  const sa2 = require('sweetalert2')
  const plg = {}

  plg.install = function (Vue) { Vue.prototype.swal = sa2 }

  Vue.use(plg)
}
