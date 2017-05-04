<template lang="html">
  <section class="Users">
    <div class="Authorized" v-if="authenticated">
      <h1 class="Pg-header">Profile</h1>

      <div class="User">
        <u-name :profile="profile"/>

        <u-mail v-if="own"/>

        <u-pass v-if="own"/>

        <u-bio :profile="profile"/>

        <u-pic :profile="profile"/>

        <u-reg :profile="profile"/>

        <u-comm :profile="profile"/>
      </div>
    </div>

    <app-err v-else :error="noAuth"/>

    <app-err v-if="error && ! authenticated" :error="error"/>
  </section>
</template>


<script type="text/javascript">
  import appErr from '~components/app-error.vue'
  import axios from 'axios'
  import uBio from '~components/_user/_user-bio.vue'
  import uComm from '~components/_user/_user-comments.vue'
  import uName from '~components/_user/_user-name.vue'
  import uMail from '~components/_user/_user-email.vue'
  import uPass from '~components/_user/_user-pw.vue'
  import uPic from '~components/_user/_user-avatar.vue'
  import uReg from '~components/_user/_user-registered.vue'
  import { mapGetters } from 'vuex'

  export default {
    asyncData ({ store, params }) {
      let token = store.getters['users/storedUser'].access_token

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

        return axios.get(`${process.env.apiUrl}users/${params.slug}`)
          .then((r) => { return { error: false, profile: r.data.user } })
          .catch((e) => { return { error: e, profile: false } })
      }

      return { error: { status: 403, message: 'Forbidden - Authentication Required' }, profile: false }
    },

    components: { appErr, uBio, uComm, uMail, uName, uPass, uPic, uReg },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authenticated () {
        return this.storedUser.authenticated
      },

      noAuth () {
        return { status: 403, message: 'Login required to access this page.' }
      },

      own () {
        return this.storedUser.slug === this.$route.params.slug
      }
    },

    head () {
      let title = this.own ? `User ${this.profile.name}` : 'User Profile'

      return {
        title: title,
        meta: [{ hid: 'robots', name: 'robots', content: 'NOINDEX,NOFOLLOW' }] }
    },

    middleware: 'auth',

    name: 'User'
  }
</script>
