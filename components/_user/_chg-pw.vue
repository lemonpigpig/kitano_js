<template lang="html">
  <div class="Change-pw">
    <div class="H-Form" role="form">
      <form-head message="Change Password"/>

      <div class="H-Form__Body">
        <form-input v-model="fields.old_password.value"
                    type="password"
                    name="old_password"/>

        <form-input v-model="fields.password.value"
                    type="password"
                    name="password"/>

        <form-input v-model="fields.password_confirmation.value"
                    type="password"
                    name="password_confirmation"
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
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: { formError, formHead, formInput },

    computed: {
      ...mapGetters('users', ['storedUser']),

      buttonText () {
        return this.submitting ? 'Working' : 'Change'
      },

      buttonClass () {
        return this.submitting ? this.buttonPulse() : this.buttonStill() // @vue-mixins
      },

      userSlug () {
        return this.storedUser.slug
      }
    },

    data () {
      return {
        fields: {
          'old_password': {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'password'
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
        payload: {},
        errors: '',
        submitting: false
      }
    },

    methods: {
      ...mapMutations('profile', ['setCancelEdit', 'setChangedPw']),

      // Close Form
      cancel () {
        this.setCancelEdit('password')
      },

      // Show validation errors
      displayErrors () {
        this.errors = this.processValidationErrors(this.fields) // @vue-validation
        this.submitting = false
        this.focusFirstError() // @vue-mixins
      },

      // Process errors returned by API server
      processResponseErrors (e) {
        // check error is validation
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

        this.errors = e.response.data ? e.response.data.message : e.message
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

      // Compose API request payload
      setPayload () {
        this.payload = {
          '_method': 'PATCH',
          'old_password': this.fields.old_password.value,
          'password': this.fields.password.value,
          'password_confirmation': this.fields.password_confirmation.value
        }
      },

      // Start the submission process
      submitForm () {
        if (this.submitting) { return false } // prevent multiple submissions

        this.resetErrors() // Clear the previous form errors
        this.submitting = true
        this.fields = this.validate(this.fields) // @vue-validation

        if (this.validationHasErrors(this.fields)) { // @vue-validation
          this.displayErrors()
          return false
        }

        this.setPayload() // prepare data for submission

        // POST form
        axios.post(`${process.env.apiUrl}users/${this.userSlug}`, this.payload)
          .then((r) => { this.setChangedPw(true) }) // @vuex mutation
          .catch((e) => { this.processResponseErrors(e) })
      }
    },

    mounted () {
      this.focusFirstInput() // @vue-mixins
    }
  }
</script>
