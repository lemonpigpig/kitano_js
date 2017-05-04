import axios from 'axios'
import Vue from 'vue'
import { replace, split } from 'lodash'
import { mapGetters } from 'vuex'

Vue.mixin({
  computed: {
    ...mapGetters('users', ['storedUser'])
  },

  methods: {
    // add class 'error' to input element
    addErrorClass (id) {
      if (!id) { return false }
      let el = document.getElementById(id)
      if (el) { el.className += ' error' }
    },

    // add class 'error' to all or list of input elements
    addErrorClasses (els) {
      if (els === '*' || !els) {
        let els = document.getElementsByClassName('Field')

        for (let i = 0; i < els.length; i++) {
          let el = els[i]
          if (el.className) { el.className += ' error' }
        }
      } else {
        for (let f in els) {
          let e = document.getElementById(els[f])
          if (e) { e.className += ' error' }
        }
      }
    },

    // pulsing button
    buttonPulse (type = 'default') {
      return `Button Button_${type} Button_pulse`
    },

    // default button
    buttonStill (type = 'default') {
      return `Button Button_${type}`
    },

    // inserts authorization header in axios for authed users
    checkAxiosAuthorizationHeader () {
      let axiosAuth = axios.defaults.headers.common['Authorization']
      let token = this.storedUser.access_token
      let authed = this.storedUser.authenticated
      let needsHeader = axiosAuth === undefined && authed && token

      if (needsHeader) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}` }
    },

    // check mark with message
    checkMark (text) {
      if (!text) { text = '' }
      return `<span style="color:#4DBA87;">&nbsp;&#10003;&nbsp;${text}</span>`
    },

    // compute expiration date for token
    computeExpiration (token) {
      let dt = new Date()
      return ((dt.getTime() / 1000) + (token * 1000))
    },

    // remove spaces, colons and dashes from dates
    digitizeDate (date) {
      if (!date) { return '' }

      let s = split(date, ' ')
      let s0 = replace(s[0], new RegExp('-', 'g'), '')
      let s1 = replace(s[1], new RegExp(':', 'g'), '')

      return `${s0}${s1}`
    },

    // times mark with message
    errorMark (text) {
      if (!text) { text = '' }
      return `<span style="color:#E74430;">&nbsp;&#33;&nbsp;${text}</span>`
    },

    // focus element
    focus (id) {
      if (!id) { return false }
      let el = document.getElementById(id)
      if (el) { el.focus() }
    },

    // focus first input in dom
    focusFirstInput () {
      let els = document.getElementsByClassName('Field')
      els[0].focus()
    },

    // focus first input with error class
    focusFirstError () {
      let errEls = document.getElementsByClassName('error')
      if (!errEls.length) { return false }
      errEls[0].focus()
    },

    // check if a property is present in object
    isDefined (obj, prop) {
      return obj.hasOwnProperty(prop) && obj[prop] !== undefined
    },

    isErrorBag (e) {
      return e.response && e.response.status && e.response.status === 422
    },

    // ordinalize numbers
    ordinalize (number) {
      if (!number || isNaN(number)) { return number }

      let ten = number % 10
      let hund = number % 100
      if (ten === 1 && hund !== 11) { return `${number}st` }
      if (ten === 2 && hund !== 12) { return `${number}nd` }
      if (ten === 3 && hund !== 13) { return `${number}rd` }

      return `${number}th`
    },

    // clear all form error classes
    removeErrorClasses () {
      let errEls = document.getElementsByClassName('Field')

      for (let i = 0; i < errEls.length; i++) {
        let el = errEls[i]
        if (el.classList) { el.classList.remove('error') }
      }
    },

    // sanitizes email addresses
    sanitizeEmail (email) {
      return email.trim().toLowerCase()
    },

    // computes elapsed seconds since a given date
    secondsSince (since) {
      let dtNow = new Date()
      let dtNowSecs = dtNow.getTime() / 1000
      let dtSince = new Date(since)
      let dtSinceSecs = dtSince.getTime() / 1000

      return Math.trunc(dtNowSecs - dtSinceSecs)
    },

    // sort an array with given element first
    sortAndPutFirst (arrayToSort, first) {
      if (!first) { return arrayToSort }

      let len = arrayToSort.length
      let a = []
      let b = []

      for (let i = 0; i < len; i++) {
        arrayToSort[i] === first ? a.push(arrayToSort[i]) : b.push(arrayToSort[i])
      }

      return a.concat(b)
    },

    // default user model
    userModel () {
      return {
        attempts: 0,
        authenticated: false,
        freezed: false,
        name: '',
        pw: '',
        registering: false,
        resetting: false
      }
    }
  }
})
