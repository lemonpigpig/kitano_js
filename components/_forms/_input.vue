<template lang="html">
  <div class="H-Form__Item">
    <h3 v-if="info" v-html="info"/>

    <label v-if="isRequired" class="Form__Group__Label" :for="name">{{ capitalizedName }}<sup>*</sup></label>

    <label v-else class="Form__Group__Label" :for="name">{{ capitalizedName }}</label>

    <input :id="name"
           :disabled="disabled"
           :name="name"
           :placeholder="capitalizedName"
           :required="isRequired"
           type="email"
           class="Field"
           v-if="type==='email'"
           v-bind:value="value"
           v-on:input="updateValue($event.target.value)"
           v-on:focus="selectAll"
           v-on:keyup.enter="enterPressed">

    <input :id="name"
           :disabled="disabled"
           :name="name"
           :placeholder="capitalizedName"
           :required="isRequired"
           type="text"
           class="Field"
           v-if="type==='text'"
           v-bind:value="value"
           v-on:input="updateValue($event.target.value)"
           v-on:focus="selectAll"
           v-on:keyup.enter="enterPressed">

    <input :id="name"
           :disabled="disabled"
           :name="name"
           :placeholder="capitalizedName"
           :required="isRequired"
           type="password"
           class="Field"
           v-if="type==='password'"
           v-bind:value="value"
           v-on:input="updateValue($event.target.value)"
           v-on:focus="selectAll"
           v-on:keyup.enter="enterPressed">
  </div>
</template>


<script type="text/javascript">
  import { replace, startCase } from 'lodash'

  export default {
    data () {
      return {
        capitalizedName: startCase(replace(this.name, '_', ' '))
      }
    },

    methods: {
      enterPressed (e) {
        this.$emit('keyEnter', e)
      },

      selectAll (e) {
        setTimeout(() => { e.target.select() }, 0)
      },

      updateValue (value) {
        this.$emit('input', value)
      }
    },

    props: {
      disabled: {
        required: false,
        default: false,
        type: Boolean
      },
      value: {
        required: true,
        type: String,
        default: ''
      },
      name: {
        required: true,
        type: String,
        default: 'email'
      },
      isRequired: {
        required: false,
        default: true,
        type: Boolean
      },
      info: {
        required: false,
        type: String,
        default: ''
      },
      type: {
        required: false,
        default: 'text',
        type: String
      }
    },

    name: 'FormInput'
  }
</script>
