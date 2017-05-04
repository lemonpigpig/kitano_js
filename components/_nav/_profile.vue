<template lang="html">
  <nuxt-link class="App-nav__Wrapper__Right__button"
             :to="{ path: `/users/${storedUser.slug}`, params: {slug: storedUser.slug} }"
  >{{ storedUser.name }}</nuxt-link>
</template>


<script type="text/javascript">
  import { mapGetters } from 'vuex'
  export default { computed: { ...mapGetters('users', ['storedUser']) } }
</script>
