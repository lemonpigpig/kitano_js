<template lang="html">
  <div class="Comment__Likes">
    <svg-icon icon="like"
              :ariaText="svgText"
              :iconClass="svgClass"
              :iconText="iconText"/>
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

      iconText () {
        return this.comment.likes.total.toString()
      },

      isRegistering () {
        return this.storedUser.registering
      },

      isLikeable () {
        return !this.isLiked && !this.isRegistering && this.storedUser
      },

      isLiked () {
        return this.storedUser ? includes(this.comment.likes.users, this.storedUser.slug) : false
      },

      svgClass () {
        let base = 'Svg__Icon'
        let liked = this.isLiked ? ` ${base}_active` : ''
        let clickable = this.isLikeable ? ` ${base}_clickable` : ` ${base}_unclickable`

        return `${base}${liked}${clickable}`
      },

      svgText () {
        if (this.isLikeable) { return 'Click to like this comment' }
        let num = this.comment.likes.total
        let word = num > 1 || !num ? ' Likes' : ' Like'

        return this.isLiked ? 'You Like This Comment' : num ? num + word : 'Likes'
      }
    },

    data () {
      return {
        liking: false
      }
    },

    methods: {
      addLike () {
        this.comment.likes.users.push(this.storedUser.slug)
        this.comment.likes.total++
        this.liking = false
      },

      alertError (e) {
        let alert = { title: 'Nope!', text: 'Something went wrong', type: 'error' }

        alert.text += e.response ? `: ${e.response.message}` : `: ${e.message}`
        this.swal(alert).catch(this.swal.noop)
        this.liking = false
      },

      like () {
        if (!this.isLikeable || this.liking) { return false }

        this.liking = true
        axios.post(`${process.env.articlesUrl}/${this.articleId}/comments/${this.comment.id}/like`)
          .then((r) => { this.addLike() })
          .catch((e) => { this.alertError(e) })
      }
    },

    props: {
      comment: {
        required: true,
        type: Object
      },
      articleId: {
        required: true,
        type: String
      }
    }
  }
</script>
