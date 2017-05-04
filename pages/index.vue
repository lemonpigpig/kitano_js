<template lang="html">
  <home-page/>
</template>


<script type="text/javascript">
  import homePage from '~components/_static_content/home.vue'

  export default {
    components: { homePage },

    head () {
      return { title: 'Home' }
    },

    name: 'Home'
  }
</script>
