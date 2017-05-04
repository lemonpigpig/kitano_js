<template lang="html">
  <div class="Default">
    <app-hero/>

    <app-nav/>

    <nuxt :class="containerClass" v-cloak/>

    <app-footer/>
  </div>
</template>


<script type="text/javascript">
  import AppFooter from '~components/Footer.vue'
  import AppHero from '~components/hero.vue'
  import AppNav from '~components/Nav.vue'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    beforeMount () {
      this.checkAxiosAuthorizationHeader() // @vue-mixins

      if (!this.storedUser) {
        this.setUser(this.userModel()) // @vuex mutation | @vue-mixins
        this.saveUser() // @vuex action
      }
    },

    components: { AppFooter, AppHero, AppNav },

    computed: {
      ...mapGetters('eventHub', ['getEvent']),
      ...mapGetters('users', ['storedUser']),

      blurred () {
        return this.getEvent === 'blur'
      }
    },

    data () {
      return {
        containerClass: 'App-container'
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', ['setUser'])
    },

    name: 'Kitano',

    watch: {
      'blurred' () {
        this.containerClass = this.blurred ? 'App-container App-container_blur' : 'App-container'
      }
    }
  }
</script>
