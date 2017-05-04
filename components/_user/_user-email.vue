<template lang="html">
  <div class="User__Email">
    <div class="User__Key" v-html="'Email'"/>

    <div class="User__Val">
      <button class="Button Button_green Button_small"
              type="button"
              v-html="'Change'"
              :disabled="!canEdit"
              name="change"
              @click.prevent="change"/>
    </div>

    <div class="User__Error" v-html="error"/>

    <transition name="fade">
      <chg-email v-if="show && canEdit"/>
    </transition>
  </div>
</template>


<script type="text/javascript">
  import chgEmail from '~components/_user/_chg-email.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeDestroy () {
      this.unsetEditingField()
    },

    components: { chgEmail },

    computed: {
      ...mapGetters('users', ['storedUser']),
      ...mapGetters('profile', ['editingField', 'cancelEdit', 'changedEmail', 'changedPw']),

      canEdit () {
        return !this.editingField || this.editingField === 'email'
      },

      own () {
        return this.userSlug === this.$route.params.slug
      },

      userSlug () {
        return this.storedUser.slug
      }
    },

    data () { return { error: '', show: false } },

    methods: {
      ...mapMutations('profile', ['setEditingField', 'setChangedEmail', 'unsetCancelEdit', 'unsetEditingField']),

      change () {
        this.show = !this.show
      }
    },

    watch: {
      'cancelEdit' () {
        if (this.cancelEdit === 'email') {
          this.change()
          this.unsetCancelEdit() // @vuex mutation
        }
      },

      'changedEmail' () {
        if (this.changedEmail) {
          this.change()
          this.error = this.checkMark('Email updated') // @vue-mixins
          setTimeout(() => {
            this.error = ''
            this.setChangedEmail(false) // @vuex mutation
          }, 3000)
        }
      },

      'show' () {
        this.show ? this.setEditingField('email') : this.unsetEditingField() // @vuex mutation
      }
    }
  }
</script>
