<template lang="html">
  <a href="#"
     class="App-nav__Wrapper__Right__button"
     @click.prevent="doLogout"
  >Logout</a>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    beforeMount () {
      this.checkAxiosAuthorizationHeader() // @vue-mixins
    },

    computed: { ...mapGetters('users', ['storedUser']) },

    methods: {
      ...mapActions('users', ['saveUser', 'logout']),
      ...mapMutations('users', ['setUser']),

      doLogout () {
        this.swal({
          title: 'Logout',
          text: `Leaving already, ${this.storedUser.name}?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, get me out!'
        }).then(() => {
          axios.post(`${process.env.apiUrl}logout`)
            .then((r) => {
              axios.defaults.headers.common['Authorization'] = null
              this.setUser(this.userModel()) // @vuex mutation | @vue-mixins
              this.saveUser()
              this.logout()
              this.swal({
                title: 'Bye!',
                text: 'Your session was terminated. See you soon!',
                type: 'success',
                timer: 3000
              }).catch(this.swal.noop)
            })
            .catch((e) => { console.log(e) })
        }).catch(this.swal.noop)
      }
    },

    name: 'Logout'
  }
</script>
