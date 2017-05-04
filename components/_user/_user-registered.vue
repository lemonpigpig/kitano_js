<template lang="html">
  <div class="User__Registered">
    <div class="User__Key" v-html="'Registered'"/>

    <div class="User__Val">
      {{ profile.created | dateFormat }} ({{ profile.created | fromNow }})
    </div>
  </div>
</template>


<script type="text/javascript">
  export default {
    props: {
      profile: {
        required: true,
        type: Object
      }
    }
  }
</script>
