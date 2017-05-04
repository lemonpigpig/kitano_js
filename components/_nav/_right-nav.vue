<template lang="html">
  <div class="App-nav__Wrapper__Right">
      <profile v-if="authenticated"/>

      <logout v-if="authenticated"/>

      <auth v-else/>
  </div>
</template>


<script type="text/javascript">
  import auth from '~components/_auth/_authentication.vue'
  import logout from '~components/_auth/_logout.vue'
  import profile from '~components/_nav/_profile.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: { auth, logout, profile },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authenticated () {
        return this.storedUser.authenticated
      }
    }
  }
</script>
