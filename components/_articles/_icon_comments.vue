<template lang="html">
  <div class="Article__Footer__Icon Article__Footer__Icon_comments">
    <svg-icon icon="comment"
              :ariaText="ariaText"
              :iconClass="iconClass"
              :iconText="iconText"/>
  </div>
</template>


<script type="text/javascript">
  import svgIcon from '~components/_icons/_svg-icon.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: { svgIcon },

    computed: {
      ...mapGetters('users', ['storedUser']),

      ariaText () {
        let base = 'comment'
        let pre = 'You have'
        let num = this.numberOfComments
        let own = num > 1 ? `${base}s` : base

        if (!this.storedUser || !num) {
          let total = this.article.comments.total
          let res = total > 1 ? `${base}s` : base

          return `${total} ${res}`
        }

        if (!num) { return 'You haven\'t posted any comments yet' }

        return `${pre} ${num} ${own}`
      },

      iconClass () {
        let base = 'Svg__Icon'
        let active = !this.userCommented ? '' : ` ${base}_active`

        return !this.storedUser ? base : `${base}${active}`
      },

      iconText () {
        return this.article.comments.total.toString()
      },

      isAuthed () {
        return this.storedUser.authenticated
      },

      isCommented () {
        return this.isDefined(this.article, 'comments') // @vue-mixins
      },

      numberOfComments () {
        return this.userCommented ? this.posters[this.userSlug] : 0
      },

      posters () {
        return this.article.comments.users
      },

      userCommented () {
        return this.isAuthed && this.isCommented && this.isDefined(this.posters, this.userSlug)
      },

      userSlug () {
        return this.storedUser.slug
      }
    },

    props: {
      article: {
        required: true,
        type: Object
      }
    }
  }
</script>
