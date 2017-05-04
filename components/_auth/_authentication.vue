<template lang="html">
  <div class="App-nav__Wrapper__Right_auth">
    <a href="#"
       title="Confirm Registration"
       :class="registerClass"
       @click.prevent="showConfirm"
       v-if="isRegistering"
    >Auth::confirm('{{ authedEmail }}')</a>

    <a href="#"
       title="Register"
       :class="registerClass"
       @click.prevent="showRegister"
       v-if="!isRegistering"
    >Auth::create()</a>

    <a href="#"
       title="Login"
       :class="loginClass"
       @click.prevent="showLogin"
       v-if="!isRegistering"
    >Auth::login()</a>

    <transition name="fade">
      <login v-if="isAuthing && isLogin" />
    </transition>

    <transition name="fade">
      <register v-if="isAuthing && isRegistration" />
    </transition>

    <transition name="fade">
      <confirm v-if="isRegistering && isConfirm" />
    </transition>
  </div>
</template>


<script type="text/javascript">
  import confirm from '~components/_auth/_confirm.vue'
  import login from '~components/_auth/_login.vue'
  import register from '~components/_auth/_register.vue'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    components: { confirm, login, register },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authedEmail () {
        return this.isDefined(this.storedUser, 'email') ? this.storedUser.email : ''
      },

      isLogin () {
        return this.mode === 'login' && !this.isRegistering
      },

      isRegistration () {
        return this.mode === 'register' && !this.isRegistering
      },

      isRegistering () {
        return this.isDefined(this.storedUser, 'registering') && this.storedUser.registering
      },

      loginClass () {
        let active = this.isLogin ? ' active' : ''

        return `App-nav__Wrapper__Right__button${active} Auth-nav`
      },

      registerClass () {
        let active = this.isRegistration ? ' active' : ''

        return `App-nav__Wrapper__Right__button${active}`
      }
    },

    data () {
      return {
        isAuthing: false,
        isConfirm: true,
        mode: false
      }
    },

    methods: {
      ...mapMutations('eventHub', ['setEvent', 'unsetEvents']),

      showConfirm () {
        this.isConfirm = !this.isConfirm
      },

      showLogin () {
        this.mode = this.isLogin ? false : 'login'
      },

      showRegister () {
        this.mode = this.isRegistration ? false : 'register'
      }
    },

    watch: {
      'mode' () {
        if (this.mode === 'login') { this.isAuthing = this.isLogin }
        if (this.mode === 'register') { this.isAuthing = this.isRegistration }
        if (this.mode !== false) {
          this.setEvent('blur')
        } else {
          this.unsetEvents()
        }
      }
    }
  }
</script>
