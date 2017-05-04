<template lang="html">
  <div class="Change-email">
    <div class="H-Form" role="form">
      <form-head message="Change Email"/>

      <div class="H-Form__Body">
        <form-input v-model="fields.old_email.value"
                    type="email"
                    name="old_email"/>

        <form-input v-model="fields.email.value"
                    type="email"
                    name="email"/>

        <form-input v-model="fields.email_confirmation.value"
                    type="email"
                    name="email_confirmation"
                    @keyEnter="submitForm"/>

        <form-error :msg="errors"/>
      </div>

      <div class="H-Form__Footer">
        <div class="H-Form__Item H-Form__Button H-Form__Button_group">
          <button type="button"
                  name="cancel"
                  class="Button Button_green"
                  v-html="'Cancel'"
                  :disabled="submitting"
                  @click.prevent="cancel"/>

          <button type="submit"
                  name="button"
                  v-html="buttonText"
                  :class="buttonClass"
                  :disabled="submitting"
                  @click.prevent="submitForm"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import formError from '~components/_forms/_form-error.vue'
  import formHead from '~components/_forms/_form-header.vue'
  import formInput from '~components/_forms/_input.vue'
  import { head } from 'lodash'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: { formError, formHead, formInput },

    computed: {
      ...mapGetters('users', ['storedUser']),

      buttonText () {
        return this.submitting ? 'Working' : 'Change'
      },

      buttonClass () {
        return this.submitting ? this.buttonPulse() : this.buttonStill() // @vue-mixins
      }
    },

    data () {
      return {
        fields: {
          'old_email': {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'email'
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
          'email_confirmation': {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'email',
              match: 'email'
            }
          }
        },
        payload: {},
        errors: '',
        submitting: false
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('profile', ['setChangedEmail', 'setCancelEdit']),
      ...mapMutations('users', ['setAvatar']),

      // Close Form
      cancel () {
        this.setCancelEdit('email')
      },

      // Show validation errors
      displayErrors () {
        this.errors = this.processValidationErrors(this.fields) // @vue-validation
        this.submitting = false
        this.focusFirstError() // @vue-mixins
      },

      // Process errors returned by API server
      processResponseErrors (e) {
        let isErrorBag = e.response !== undefined && e.response.status === 422

        if (isErrorBag) {
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

        this.errors = e.response !== undefined && e.response.data ? e.response.data.message : e.message
        this.submitting = false
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

      // Set up change email model
      setPayload () {
        this.payload = {
          '_method': 'PATCH',
          'old_email': this.sanitizeEmail(this.fields.old_email.value), // @vue-mixins
          'email': this.sanitizeEmail(this.fields.email.value), // @vue-mixins
          'email_confirmation': this.sanitizeEmail(this.fields.email_confirmation.value) // @vue-mixins
        }
      },

      // Start the submission process
      submitForm () {
        if (this.submitting) { return false } // prevent multiple submissions

        this.resetErrors() // Clear previous form errors
        this.submitting = true
        this.fields = this.validate(this.fields) // @vue-validation

        if (this.validationHasErrors(this.fields)) { // @vue-validation
          this.displayErrors()
          return false
        }

        this.setPayload() // prepare data for submission

        // POST form
        axios.post(`${process.env.apiUrl}users/${this.storedUser.slug}`, this.payload)
          .then((r) => { this.vuexUser(r) })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Store user @Vuex
      vuexUser (r) {
        // avatar may change when user changes email, so
        // we will update stored user when response
        // includes an avatar property.
        if (r.data.hasOwnProperty('avatar')) {
          this.setAvatar(r.data.avatar) // @vuex mutation
          this.saveUser() // @vuex action
        }

        this.setChangedEmail(true) // @vuex mutation
      }
    },

    mounted () {
      this.focusFirstInput() // @vue-mixins
    }
  }
</script>
