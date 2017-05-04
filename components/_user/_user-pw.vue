<template lang="html">
  <div class="User__Pw">
    <div class="User__Key" v-html="'Password'"/>

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
      <chg-pw v-if="show && canEdit"/>
    </transition>
  </div>
</template>


<script type="text/javascript">
  import chgPw from '~components/_user/_chg-pw.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeDestroy () { this.unsetEditingField() },

    components: { chgPw },

    computed: {
      ...mapGetters('users', ['storedUser']),
      ...mapGetters('profile', ['editingField', 'cancelEdit', 'changedPw']),

      canEdit () {
        return !this.editingField || this.editingField === 'password'
      },

      own () {
        return this.storedUser.slug === this.$route.params.slug
      }
    },

    data () {
      return {
        error: '',
        show: false
      }
    },

    methods: {
      ...mapMutations('profile', [
        'setChangedPw',
        'setEditingField',
        'unsetCancelEdit',
        'unsetEditingField'
      ]),

      change () {
        this.show = !this.show
      }
    },

    watch: {
      'cancelEdit' () {
        if (this.cancelEdit === 'password') {
          this.change()
          this.unsetCancelEdit() // @vuex mutation
        }
      },

      'changedPw' () {
        if (this.changedPw) {
          this.change()
          this.error = this.checkMark('Password updated') // @vue-mixins
          setTimeout(() => {
            this.error = ''
            this.setChangedPw(false) // @vuex mutation
          }, 3000)
        }
      },

      'show' () {
        this.show ? this.setEditingField('password') : this.unsetEditingField()  // @vuex mutation
      }
    }
  }
</script>
