<template lang="html">
  <div class="User__Avatar">
    <div class="User__Key" v-html="'Avatar'"/>

    <div class="User__Val" v-if="own">
      <div class="Editable Editable_clickable hint--right"
           :aria-label="label"
           v-if="user.avatar"
           @click="change"
      ><img :src="user.avatar" :alt="user.name"></div>

      <div class="Editable Editable_clickable hint--right"
           :aria-label="label"
           role="link"
           v-else
           @click="change">
         <avatar/>
     </div>
    </div>

    <div class="User__Val" v-else>
      <avatar/>
    </div>

    <div class="User__Error" v-html="error"/>
  </div>
</template>


<script type="text/javascript">
  import avatar from '~components/_icons/_avatar.vue'
  import axios from 'axios'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    components: { avatar },

    computed: {
      ...mapGetters('users', ['storedUser']),

      label () {
        return 'Click to update'
      },

      own () {
        return this.storedUser.slug === this.$route.params.slug
      },

      user () {
        return this.own ? this.storedUser : this.profile
      }
    },

    data () {
      return {
        error: ''
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('users', ['setAvatar']),

      change () {
        this.swal({
          confirmButtonText: 'Update',
          html: 'Create our update your <a target="_blank" href="http://gravatar.com/">Gravatar</a>' +
          ' account, and hit <strong>Update</strong>',
          showCancelButton: true,
          title: 'Change Avatar',
          type: 'info'
        }).then(() => { this.update() }).catch(this.swal.noop)
      },

      processUpdate (r) {
        if (r.data.hasOwnProperty('avatar')) {
          let avatar = r.data.avatar

          if (avatar && avatar !== this.storedUser.avatar) {
            this.setAvatar(avatar) // @vuex mutation
            this.saveUser() // @vuex action
            this.error = this.checkMark('Avatar updated') // @vue-mixins
            setTimeout(() => { this.error = '' }, 3000)
          } else {
            this.error = this.errorMark('Nothing updated') // @vue-mixins
            setTimeout(() => { this.error = '' }, 3000)
          }
        }
      },

      update () {
        let payload = { '_method': 'PATCH', avatar: 'gravatar' }

        axios.post(`${process.env.apiUrl}users/${this.storedUser.slug}`, payload)
          .then((r) => { this.processUpdate(r) })
          .catch((e) => { this.error = e.response.data.message })
      }
    },

    props: {
      profile: {
        required: true,
        type: Object
      }
    }
  }
</script>
