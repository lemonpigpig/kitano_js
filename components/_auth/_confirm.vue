<template lang="html">
  <section class="Authentication">
    <div class="H-Form" role="form">
      <form-head message="Confirmation Code"/>

      <div class="H-Form__Body">
        <form-input v-model="code"
                    :info="infoText"
                    @keyEnter="submitForm"
                    name="code"/>

        <form-error :msg="errors"/>
      </div>

      <div class="H-Form__Footer">
        <div class="H-Form__Item H-Form__Button_group">
          <button type="button"
                  name="resend"
                  v-html="resendText"
                  v-if="canResend"
                  :class="resendClass"
                  :disabled="submitting || resending"
                  @click.prevent="resendCode"/>

          <button type="submit"
                  name="submit"
                  v-html="buttonText"
                  :class="submitClass"
                  :disabled="submitting || resending"
                  @click.prevent="submitForm"/>
        </div>
      </div>
    </div>
  </section>
</template>


<script type="text/javascript">
  const defaultInfoText = 'Check your Inbox to get your confirmation code'
  const blownInfoText = 'Check your Spam Folder as well. Already sent 3 codes! You can try again in 60 min.'

  import axios from 'axios'
  import formError from '~components/_forms/_form-error.vue'
  import formHead from '~components/_forms/_form-header.vue'
  import formInput from '~components/_forms/_input.vue'
  import { assign } from 'lodash'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: { formError, formHead, formInput },

    computed: {
      ...mapGetters('users', ['storedUser']),

      buttonText () {
        return this.submitting ? 'Working' : 'Verify'
      },

      canResend () {
        return this.storedUser.attempts < 3
      },

      infoText () {
        return this.storedUser.attempts < 3 ? defaultInfoText : blownInfoText
      },

      resendClass () {
        return this.resending ? this.buttonPulse() : this.buttonStill() // @vue-mixins
      },

      resendText () {
        return this.resending ? 'Working' : 'Resend Code'
      },

      resetting () {
        return this.storedUser.resetting
      },

      submitClass () {
        return this.submitting ? this.buttonPulse() : this.buttonStill() // @vue-mixins
      }
    },

    data () {
      return {
        authToken: false,
        code: '',
        errors: '',
        loginData: {
          grant_type: process.env.grantType,
          client_id: process.env.clientId,
          client_secret: process.env.clientSecret,
          username: this.$store.getters['users/storedUser'].email,
          password: this.$store.getters['users/storedUser'].pw
        },
        resending: false,
        submitting: false
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', [
        'incrementAttempts',
        'setAttempts',
        'setAuthed',
        'setRegistering',
        'setResetting',
        'setUser'
      ]),

      // Request user from API
      getUser (token) {
        this.authToken = token
        this.authToken.expires_in = this.computeExpiration(token.expires_in) // @vue-mixins

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.authToken.access_token
        axios.get(`${process.env.apiUrl}user`)
          .then((r) => { this.vuexUser(r) })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Login confirmed user
      loginUser () {
        axios.post(process.env.apiTokenUrl, this.loginData)
          .then((r) => { this.getUser(r.data) })
          .catch((e) => { this.processResponseErrors(e) })
      },

      processAttempts (e) {
        let attmpt = e.response.data.count

        if (attmpt) {
          this.setAttempts(attmpt)
          this.saveUser() // @vuex action
          this.errors = e.response.data.message
        } else {
          this.errors = e.response ? e.response.data.message : e.message

          // failsafe: if for some reason store didn't record attempts. API will keep track
          if (e.response.data.error === 'http_unauthorized') {
            this.setAttempts(3) // @vuex mutation
            this.saveUser() // @vuex action
          }
        }

        this.resending = false
        this.focus('code') // @vue-mixins
      },

      // Process errors returned by API
      processResponseErrors (e, msg) {
        if (msg) {
          this.errors = msg // we won't use laravel's error bag. just output 'invalid code'.
        } else {
          this.errors = e.response ? e.response.data.message : e.message
        }

        this.submitting = false
        this.addErrorClass('code') // @vue-mixins

        if (this.resetting && e.response.status !== 422) { this.vuexCancelReset() }
        this.focus('code') // @vue-mixins
      },

      // Send new Code to registered user
      resendCode () {
        this.resending = true
        this.errors = ''
        this.removeErrorClasses() // @vue-mixins
        this.incrementAttempts() // @vuex mutation

        let addr = this.loginData.username

        axios.post(process.env.apiResendUrl, { email: addr })
          .then((r) => { this.vuexResends(r.data.count) }) // @vuex mutation
          .catch((e) => { this.processAttempts(e) })
      },

      // Reset Password
      resetPassword () {
        axios.post(`${process.env.apiUrl}reset`, this.loginData)
          .then((r) => { this.loginUser() })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Submit Code for verification
      submitForm () {
        if (!this.code) { // prevent empty submissions
          this.errors = 'Please paste your code'
          this.addErrorClass('code') // @vue-mixins
          this.focus('code') // @vue-mixins

          return false
        }

        this.removeErrorClasses() // @vue-mixins
        this.errors = ''
        this.submitting = true

        axios.post(process.env.apiConfirmUrl, { code: this.code })
          .then((r) => { this.resetting ? this.resetPassword() : this.loginUser() })
          .catch((e) => { this.processResponseErrors(e, 'Invalid code') })
      },

      // Cancel reset password process
      vuexCancelReset () {
        this.swal({
          title: 'Fail!',
          text: 'The reset process was cancelled. Please, try again.',
          timer: 4000,
          type: 'error'
        }).catch(this.swal.noop)

        this.setUser(this.userModel()) // @vuex mutation | @vue-mixins
        this.saveUser() // @vuex action
      },

      // Store attempts @Vuex
      vuexResends (attempts) {
        let email = this.loginData.username
        let sfxd = this.ordinalize(this.storedUser.attempts) // @vue-mixins

        this.setAttempts(attempts) // @vuex mutation
        this.saveUser() // @vuex action
        this.resending = false

        this.swal({
          title: 'Sent!',
          text: `A ${sfxd} Code was sent to ${email}`,
          timer: 4000,
          type: 'info'
        }).catch(this.swal.noop)

        this.focus('code') // @vue-mixins
      },

      // Store user @Vuex
      vuexUser (r) {
        this.setUser(assign(r.data, this.authToken)) // @vuex mutation
        this.setAuthed(true) // @vuex mutation
        this.setRegistering(false) // @vuex mutation
        this.setResetting(false) // @vuex mutation
        this.saveUser() // @vuex action

        this.swal({
          title: 'Authorized!',
          text: 'You are now logged in',
          type: 'success',
          timer: 3000
        }).catch(this.swal.noop)
      }
    },

    mounted () {
      this.focusFirstInput() // @vue-mixins
    }
  }
</script>
