const Moment = require('moment')

import Vue from 'vue'
import { capitalize } from 'lodash'

Vue.filter('age', date => Moment().diff(date, 'years'))

Vue.filter('capitalize', str => capitalize(str))

Vue.filter('dateFormat', date => Moment(date).format('Do MMM YYYY'))

Vue.filter('dateTimeFormat', date => Moment(date).format('Do MMM YYYY HH:mm:ss'))

Vue.filter('fromNow', time => Moment(time).fromNow())

Vue.filter('fromYearToYear', function (year) {
  let y = Moment().year()

  if (y > year) { return year + ' - ' + y }

  return year
})

Vue.filter('timeFormat', date => Moment(date).format('HH:mm:ss'))

Vue.filter('yearsAgo', howMany => Moment().year() - howMany)
