<template lang="html">
  <div :class="commentClass" :id="commentId">
    <comm-head :comment="comment"/>

    <comm-body :comment="comment"/>

    <editor v-if="canEdit" :slug="article.slug"/>

    <hr :class="belongsToUser ? 'green' : 'blue'">

    <comm-footer :commentIndex="commentIndex"
                 :comment="comment"
                 :articleId="article.slug"
                 :owned="belongsToUser"/>
  </div>
</template>


<script type="text/javascript">
  import commBody from '~components/_comments/_comment-body.vue'
  import commFooter from '~components/_comments/_comment-footer.vue'
  import commHead from '~components/_comments/_comment-head.vue'
  import editor from '~components/_comments/_editor.vue'
  import { mapGetters } from 'vuex'

  export default {
    components: { commBody, commFooter, commHead, editor },

    computed: {
      ...mapGetters('users', ['storedUser']),
      ...mapGetters('comments', ['editingComment']),

      authenticating () {
        return this.storedUser.registering
      },

      admin () {
        return this.storedUser.admin
      },

      authorMatch () {
        return this.storedUser.slug === this.comment.author.slug
      },

      belongsToUser () {
        return this.admin || (this.storedUser.authenticated && !this.authenticating && this.authorMatch)
      },

      canEdit () {
        return this.belongsToUser && this.editingComment === this.comment.id
      },

      commentId () {
        return `Comment_${this.comment.id}`
      },

      commentClass () {
        let base = 'Comment'
        let ownd = this.belongsToUser ? ` ${base}__Owned` : ''
        let edit = this.editing === this.comment.id ? ` ${ownd}_editing` : ''

        return `${base}${ownd}${edit}`
      }
    },

    props: {
      article: {
        required: true,
        type: Object
      },
      comment: {
        required: true,
        type: Object
      },
      commentIndex: {
        required: true,
        type: Number
      }
    }
  }
</script>
