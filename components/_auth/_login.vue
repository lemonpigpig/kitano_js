<template lang="html">
  <section class="Authentication">
    <div class="H-Form" role="form">
      <form-head :message="formTitle"/>

      <div class="H-Form__Body">
        <form-input v-model="fields.email.value"
                    :info="infoText"
                    name="email"
                    type="email"/>

        <form-input v-model="fields.password.value"
                    name="password"
                    type="password"
                    @keyEnter="submitForm"/>

        <form-input v-model="fields.password_confirmation.value"
                    v-if="resetting"
                    name="password_confirmation"
                    type="password"
                    @keyEnter="submitForm"/>

        <span class="No__s_p_a_m__please">Leave this as is: <input type="text" name="url" v-model="nospam"/></span>

        <form-error :msg="errors"/>
      </div>

      <div class="H-Form__Footer">
        <div class="H-Form__Item H-Form__Button_group">
          <button type="button"
                  name="resend"
                  v-html="forgotText"
                  :class="buttonStill()"
                  :disabled="submitting || sending"
                  @click.prevent="toggleForm"/>

          <button type="submit"
                  name="button"
                  v-html="submitText"
                  :class="submitClass"
                  :disabled="submitting"
                  @click.prevent="submitForm"/>
        </div>
      </div>
    </div>
  </section>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import formError from '~components/_forms/_form-error.vue'
  import formHead from '~components/_forms/_form-header.vue'
  import formInput from '~components/_forms/_input.vue'
  import { assign, head } from 'lodash'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: { formError, formInput, formHead },

    computed: {
      ...mapGetters('users', ['storedUser']),

      forgotText () {
        return this.resetting ? 'Login' : 'Forgot Pw'
      },

      formTitle () {
        return this.resetting ? 'Reset Password' : 'Login'
      },

      infoText () {
        return this.resetting ? 'Enter your new password and follow instructions.' : ''
      },

      submitClass () {
        if (this.resetting) { return this.sending ? this.buttonPulse() : this.buttonStill() }
        return this.submitting ? this.buttonPulse() : this.buttonStill()
      },

      submitText () {
        if (this.resetting) { return this.sending ? 'Working' : 'Reset' }
        return this.submitting ? 'Working' : 'Login'
      }
    },

    data () {
      return {
        access: {
          grant_type: process.env.grantType,
          client_id: process.env.clientId,
          client_secret: process.env.clientSecret
        },
        authToken: false,
        fields: {
          email: {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'email'
            }
          },
          password: {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'password'
            }
          }
        },
        errors: '',
        payload: {},
        nospam: '',
        resetting: false,
        sending: false,
        submitting: false
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', [
        'setAttempts',
        'setAuthed',
        'setEmail',
        'setPw',
        'setRegistering',
        'setResetting',
        'setUser'
      ]),

      // Show validation errors
      displayErrors () {
        this.errors = this.processValidationErrors(this.fields) // @vue-validation
        this.submitting = false
        this.focusFirstError() // @vue-mixins
      },

      // Request user from API
      getUser (token) {
        this.authToken = token
        this.authToken.expires_in = this.computeExpiration(token.expires_in) // @vue-mixins
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.authToken.access_token}`
        axios.get(`${process.env.apiUrl}user`)
          .then((r) => { this.vuexUser(r) })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // POST Login data
      postLogin () {
        this.submitting = true
        this.setPayload() // Prepare API request payload
        axios.post(process.env.apiTokenUrl, assign(this.payload, this.access))
          .then((r) => { this.getUser(r.data) })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // POST reset data
      postReset () {
        this.sending = true
        this.errors = ''
        this.setPayload() // Prepare API request payload
        axios.post(process.env.apiResendUrl, this.payload)
          .then((r) => { this.vuexReset(r.data.count) }) // @vuex mutation
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Process errors returned by API server
      processResponseErrors (e) {
        if (this.isErrorBag(e)) { // @vue-mixins
          let errors = e.response.data

          for (let field in errors) {
            if (this.fields[field]) {
              this.addErrorClass(field)
              this.fields[field].errors.push(head(errors[field]))
            }
          }

          this.displayErrors()

          return false
        }

        this.errors = e.response.data ? e.response.data.message : e.message
        this.submitting = false
        this.focusFirstInput() // @vue-mixins
      },

      // reset form
      resetForm () {
        this.submitting = false
        this.errors = ''
        this.setFields()
        this.removeErrorClasses() // @vue-mixins
        this.focusFirstInput() // @vue-mixins
      },

      // Clear form errors
      resetErrors () {
        for (let f in this.fields) {
          this.fields[f].errors = []
        }

        this.errors = ''
        this.removeErrorClasses() // @vue-mixins
      },

      // Toggle form mode
      toggleForm () {
        this.resetting = !this.resetting
      },

      // Set up fields to process
      setFields () {
        if (this.resetting) {
          this.fields.password_confirmation = {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'password',
              match: 'password'
            }
          }
        } else {
          delete this.fields['password_confirmation']
        }
      },

      // Compose API request payload
      setPayload () {
        let email = this.sanitizeEmail(this.fields.email.value)
        this.payload = this.resetting ? { email: email } : { username: email, password: this.fields.password.value }
      },

      // Start the submission process
      submitForm (e) {
        if (this.nospam !== '' || this.submitting) { return false } // prevent multiple submissions and spam bots

        this.resetErrors() // Clear previous form errors
        this.fields = this.validate(this.fields) // @vue-validation

        if (this.validationHasErrors(this.fields)) { // @vue-validation
          this.displayErrors()
          return false
        }

        this.resetting ? this.postReset() : this.postLogin()
      },

      // Store user creds & attempts @Vuex
      vuexReset (attempts) {
        let user = this.storedUser
        let storedAttempts = user.attempts ? user.attempts : 1
        let email = this.sanitizeEmail(this.fields.email.value)
        let sfxd = storedAttempts === 1 ? '' : this.ordinalize(storedAttempts) // @vue-mixins

        this.setEmail(email) // @vuex mutation
        this.setPw(this.fields.password.value) // @vuex mutation
        this.setAuthed(false) // @vuex mutation
        this.setRegistering(true) // @vuex mutation
        this.setResetting(true) // @vuex mutation
        this.setAttempts(attempts) // @vuex mutation
        this.saveUser() // @vuex action
        this.sending = false

        this.swal({
          title: 'Check your Inbox!',
          text: `A ${sfxd} Code was sent to ${email}`,
          timer: 4000,
          type: 'info'
        }).catch(this.swal.noop)

        this.focus('email') // @vue-mixins
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
      this.resetForm()
    },

    watch: {
      'resetting' () {
        this.resetForm()
      }
    }
  }
</script>
