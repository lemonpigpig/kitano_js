<template lang="html">
  <div class="H-Form__Item__error">
    <span class="Form-error" v-html="msg"></span>
  </div>
</template>


<script type="text/javascript">
    export default {
      name: 'FormError',

      props: {
        msg: {
          default: '',
          required: true,
          type: String
        }
      }
    }
</script>
