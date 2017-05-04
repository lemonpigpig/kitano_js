<template lang="html">
  <div class="Article__Footer__Icon Article__Footer__Icon_likes" v-if="article">
    <svg-icon icon="like"
              :ariaText="ariaText"
              :iconClass="iconClass"
              :iconText="totalLikes"/>
	</div>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import svgIcon from '~components/_icons/_svg-icon.vue'
  import { includes } from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    components: { svgIcon },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authed () {
        return this.storedUser.authenticated
      },

      canLike () {
        return !this.canNotLike && this.authed && this.$route.name !== 'articles'
      },

      canNotLike () {
        return this.authed && includes(this.likes.users, this.storedUser.slug)
      },

      ariaText () {
        if (this.canLike && !this.canNotLike) { return 'Click to like this article' }

        let base = 'Like'
        let total = this.likes.total
        let res = total > 1 ? `${base}s` : base

        return this.canNotLike ? 'You Like This Article' : `${total} ${res}`
      },

      iconClass () {
        let base = 'Svg__Icon'
        let clickable = this.canLike ? ` ${base}_clickable` : ` ${base}_unclickable`
        let liked = this.canNotLike ? ` ${base}_active` : ''

        return base + liked + clickable
      },

      totalLikes () {
        return this.likes.total.toString()
      }
    },

    data () {
      return {
        isLiking: false,
        likes: this.article.likes
      }
    },

    methods: {
      like () {
        if (!this.canLike || this.canNotLike || this.isLiking) { return false }

        this.isLiking = true

        axios.post(`${process.env.articlesUrl}/${this.article.slug}/like`)
          .then((r) => {
            this.likes.users.push(this.storedUser.slug)
            this.likes.total++
            this.isLiking = false
          })
          .catch((e) => {
            this.swal({
              title: 'Error!',
              text: e.response ? e.response.data.message : e.message,
              type: 'error',
              timer: 4000
            }).catch(this.swal.noop)

            this.isLiking = false
          })
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
