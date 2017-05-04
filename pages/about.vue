<template lang="html">
  <about-page/>
</template>


<script type="text/javascript">
  import aboutPage from '~components/_static_content/about.vue'

  export default {
    components: { aboutPage },

    head () {
      return {
        title: 'About Me',
        meta: [{ hid: 'description', name: 'description', content: 'Some insights on my skills, career, and experience.' }],
        link: [{ rel: 'canonical', href: `${process.env.baseUrl}${this.$route.path}` }]
      }
    },

    name: 'About'
  }
</script>
