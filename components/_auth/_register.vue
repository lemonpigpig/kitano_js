<template lang="html">
  <section class="Authentication">
    <div class="H-Form" role="form">
      <form-head message="Register"/>

      <div class="H-Form__Body">
        <form-input v-model="fields.name.value"
                    name="name"/>

        <form-input v-model="fields.email.value"
                    type="email"
                    name="email"/>

        <form-input v-model="fields.password.value"
                    type="password"
                    name="password"
                    @keyEnter="submitForm"/>

        <form-input v-model="fields.password_confirmation.value"
                    type="password"
                    name="password_confirmation"
                    @keyEnter="submitForm"/>

        <span class="No__s_p_a_m__please">Leave this as is: <input type="text" name="url" v-model="nospam"/></span>

        <form-error :msg="errors"/>
      </div>

      <div class="H-Form__Footer">
        <div class="H-Form__Item H-Form__Button">
          <button type="submit"
                  name="button"
                  v-html="buttonText"
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
  import { head } from 'lodash'
  import { mapActions, mapMutations } from 'vuex'

  export default {
    components: { formError, formInput, formHead },

    computed: {
      buttonText () {
        return this.submitting ? 'Working' : 'Register'
      },

      submitClass () {
        return this.submitting ? this.buttonPulse() : this.buttonStill()
      }
    },

    data () {
      return {
        fields: {
          name: {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'name'
            }
          },
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
          },
          'password_confirmation': {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'password',
              match: 'password'
            }
          }
        },
        errors: '',
        payload: false,
        nospam: '',
        submitting: false
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', [
        'setAttempts',
        'setEmail',
        'setName',
        'setPw',
        'setRegistering',
        'setResetting',
        'setAuthed'
      ]),

      // Show validation errors
      displayErrors () {
        this.errors = this.processValidationErrors(this.fields) // @vue-validation
        this.submitting = false
        this.focusFirstError() // @vue-mixins
      },

      // Process errors returned by API
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
        this.removeErrorClasses() // @vue-mixins
        this.focusFirstInput() // @vue-mixins
      },

      // Clear all errors
      resetErrors () {
        for (let f in this.fields) {
          this.fields[f].errors = []
        }

        this.errors = ''
        this.removeErrorClasses() // @vue-mixins
      },

      // Compose API request payload
      setPayload () {
        this.payload = {
          name: this.fields.name.value.trim(),
          email: this.sanitizeEmail(this.fields.email.value),
          password: this.fields.password.value,
          'password_confirmation': this.fields.password_confirmation.value
        }
      },

      // Start the submission process
      submitForm (e) {
        if (this.nospam !== '' || this.submitting) { return false } // prevent multiple clicks and spam bots

        if (e.target.id === 'password') {
          this.focus('password_confirmation') // focus #password_confirmation if key.enter in #password
          return false
        }

        this.resetErrors() // Clear previous form errors
        this.submitting = true
        this.fields = this.validate(this.fields) // @vue-validation

        if (this.validationHasErrors(this.fields)) { // @vue-validation
          this.displayErrors()
          return false
        }

        this.setPayload() // Compose API request payload

        // Submit
        axios.post(process.env.apiRegisterUrl, this.payload)
          .then((r) => { this.vuexRegistration() })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Store register confirmation @Vuex
      vuexRegistration () {
        this.setName(this.payload.name) // @vuex mutation
        this.setEmail(this.payload.email) // @vuex mutation
        this.setPw(this.payload.password) // @vuex mutation
        this.setAttempts(1) // @vuex mutation
        this.setRegistering(true) // @vuex mutation
        this.setResetting(false) // @vuex mutation
        this.setAuthed(false) // @vuex mutation
        this.saveUser() // @vuex action
      }
    },

    mounted () {
      this.resetForm()
    }
  }
</script>
