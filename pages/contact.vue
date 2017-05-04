<template lang="html">
  <section class="Contact">
    <h1>Contact Me</h1>

    <div class="Block">
      <p>
        Have a project you'd like to discuss?
      </p>

      <p>
        Thinking about hiring an experienced developer with a passion for challenges?
      </p>

      <p>
        Planning to refurbish your old website?
      </p>

      <p>
        <strong>Get in touch!</strong> I'll be glad to answer your queries.
      </p>
    </div>

    <div class="H-Form" role="form">
      <form-head message="Speak your mind!"/>

      <div class="H-Form__Body">
        <form-input v-if="!hasUser"
                   v-model="fields.name.value"
                   name="name"
                   :disabled="submitting || isFreezed || disabled"/>

        <form-input v-if="!hasUser"
                   type="email"
                   v-model="fields.email.value"
                   name="email"
                   :disabled="submitting || isFreezed || disabled"/>

        <div class="H-Form__Item">
          <label for="y_message">Your Message*</label>

          <textarea name="body"
                    id="body"
                    cols="30"
                    rows="10"
                    class="Field"
                    v-model="fields.body.value"
                    :disabled="submitting || isFreezed || disabled"
         	></textarea>
        </div>

        <span class="No__s_p_a_m__please">Leave this as is: <input type="text" name="url" v-model="nospam"/></span>

        <div class="H-Form__Item__error">
          <span class="Form-error" v-html="errors"/>

          <span class="Form-info" v-html="formInfo"/>
        </div>
      </div>

      <div class="H-Form__Footer">
        <div class="H-Form__Item H-Form__Button">
          <button type="submit"
                  name="button"
                  v-html="submitText"
                  :class="submitClass"
                  :disabled="submitting || isFreezed || disabled"
                  @click.prevent="submitForm"/>
        </div>
      </div>
    </div>
  </section>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import formHead from '~components/_forms/_form-header.vue'
  import formInput from '~components/_forms/_input.vue'
  import moment from 'moment'
  import { head } from 'lodash'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: { formInput, formHead },

    computed: {
      ...mapGetters('eventHub', ['getEvent']),
      ...mapGetters('users', ['storedUser']),

      blurred () {
        return this.getEvent === 'blur'
      },

      freezedTime () {
        return this.storedUser.freeze
      },

      hasUser () {
        return !!this.storedUser && this.storedUser.authenticated
      },

      remainingTime () {
        setTimeout(() => { this.secsRemaining-- }, 1000)

        if (!this.secsRemaining) {
          this.finish()
          return 0
        }

        return this.secsRemaining
      },

      submitClass () {
        let submitting = this.submitting ? ' Button_pulse' : ''
        return `Button Button_green${submitting}`
      },

      submitText () {
        if (!this.isFreezed) { return this.submitting ? 'Sending' : 'Send' }
        return `Wait ${this.remainingTime} secs`
      }
    },

    data () {
      return {
        disabled: false,
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
          body: {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'none'
            }
          }
        },
        errors: '',
        formInfo: '',
        payload: {},
        isFreezed: false,
        nospam: '',
        submitting: false,
        secsRemaining: 60
      }
    },

    head () {
      return {
        title: 'Contact Me',
        meta: [{ hid: 'description', name: 'description', content: 'Contact form' }]
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', ['setFreeze', 'setUser']),

      // Show validation errors
      displayErrors () {
        this.errors = this.processValidationErrors(this.fields) // @vue-validation
        this.submitting = false
        this.focusFirstError() // @vue-mixins
      },

      // Finish submission, unfreeze form
      finish () {
        this.isFreezed = false
        this.submitting = false
        this.secsRemaining = 60
        this.formInfo = ''
        this.unfreezeForm()
      },

      // Prevent re-submission & Inform user.
      freezeForm (isBot = false) {
        this.submitting = false
        this.isFreezed = true
        this.resetForm()

        if (this.freezedTime) {
          this.formInfo = 'Sorry, the form is freezed at the moment. Please, wait.'
        } else {
          let name = this.hasUser ? this.storedUser.name : this.fields.name.value
          let msg = `Thanks, ${name}. Your message has been sent.
          Expect a confirmation email. This form will be disabled for ${this.secsRemaining} seconds.`

          this.formInfo = isBot ? 'Thanks, Mr. Robot. Your message has been ignored just fine.' : msg
          this.setFreeze(moment()) // @vuex mutation store the current timestamp to prevent resetting timer
          this.saveUser() // @vuex action
        }
      },

      // POST to API
      postData () {
        axios.post(process.env.apiContactUrl, this.payload)
          .then((r) => { this.freezeForm() })
          .catch((e) => { this.processResponseErrors(e) })
      },

      // Process errors returned by API
      processResponseErrors (e) {
        let isErrorBag = e.response.status === 422 // check error is validation

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

      // Clear all errors
      resetErrors () {
        for (let f in this.fields) {
          this.fields[f].errors = []
        }

        this.removeErrorClasses() // removeErrorClasses() is a mixin
        this.errors = ''
      },

      // reset form elements to empty string
      resetForm () {
        this.fields.name.value = ''
        this.fields.email.value = ''
        this.fields.body.value = ''
      },

      // Compose API request payload
      setPayload () {
        this.payload = {
          body: this.fields.body.value,
          email: this.hasUser ? this.storedUser.email : this.fields.email.value.trim(),
          isuser: this.hasUser ? this.storedUser.slug : null,
          name: this.hasUser ? this.storedUser.name : this.fields.name.value.trim()
        }
      },

      // Start the submission process
      submitForm () {
        if (this.nospam !== '' || this.isFreezed || this.submitting) { // prevent multiple clicks and spam bots
          this.freezeForm(true)
          return false
        }

        this.resetErrors() // Clear previous form errors

        this.submitting = true
        this.fields = this.validate(this.fields) // @vue-validation

        if (this.validationHasErrors(this.fields)) { // @vue-validation
          this.displayErrors()
          return false
        }

        this.setPayload() // Prepare data to submit
        this.postData()
      },

      // unfreeze the form
      unfreezeForm () {
        this.setFreeze(false) // @vuex mutation
        this.saveUser() // @vuex action
      }
    },

    mounted () {
      if (this.freezedTime) {
        let since = this.secondsSince(this.freezedTime) // @vue-mixins

        if (since > 59) {
          this.unfreezeForm()
        } else {
          this.secsRemaining = 60 - since
          this.freezeForm()
        }
      }

      this.focusFirstInput() // @vue-mixins
    },

    watch: {
      'blurred' () {
        this.disabled = this.blurred
      }
    }
  }
</script>
