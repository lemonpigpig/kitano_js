<template lang="html">
  <div class="H-Form__Heading">
    <span v-if="message">{{ message }}</span>
  </div>
</template>


<script type="text/javascript">
  export default {
    props: {
      message: {
        required: true,
        type: String
      }
    }
  }
</script>
