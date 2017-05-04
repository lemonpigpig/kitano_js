<template lang="html">
  <div class="Comment__Tools">
    <svg-icon ariaText="Edit"
              v-if="!disabled"
              icon="edit"
              iconClass="Svg__Icon_clickable"
              iconText=""
              @click.prevent="editComment"/>

    <svg-icon ariaText="Delete"
              v-if="!disabled"
              icon="trash"
              iconClass="Svg__Icon_clickable"
              iconText=""
              @click.prevent="deleteComment"/>
  </div>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import svgIcon from '~components/_icons/_svg-icon.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: { svgIcon },

    computed: {
      ...mapGetters('users', ['storedUser']),
      ...mapGetters('comments', ['editingComment', 'storedComments']),

      ariaText () {
        return this.editingComment ? 'Cancel' : 'Edit'
      },

      disabled () {
        return this.registering || (this.isEditing && !this.isThisOne)
      },

      isEditing () {
        return this.editingComment !== false
      },

      isThisOne () {
        return this.editingComment === this.comment.id
      },

      registering () {
        return this.storedUser.registering
      }
    },

    methods: {
      ...mapMutations('comments', [
        'addComment',
        'setComments',
        'setEditingComment',
        'setCommentIndex',
        'unsetEditingComment'
      ]),

      editComment () {
        if (this.isEditing) {
          this.unsetEditingComment()
        } else {
          this.setEditingComment(this.comment.id)
          this.setCommentIndex(this.commentIndex)
        }
      },

      deleteComment () {
        this.swal({
          title: 'Delete Comment',
          text: 'Are you sure?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55'
        }).then(() => {
          this.removeComment()
        }).catch(this.swal.noop)
      },

      removeComment () {
        let comments = this.storedComments
        let payload = { '_method': 'DELETE' }
        let spliced = comments.splice(this.commentIndex, 1)

        this.setComments(comments)

        axios.post(`${process.env.articlesUrl}/${this.articleId}/comments/${this.comment.id}`, payload)
          .catch((e) => { this.resetComments(spliced[0]) })
      },

      resetComments (deletedComment) {
        this.addComment(deletedComment)
        this.swal({
          title: 'Error!',
          text: 'Unable to delete comment. Please try again.',
          type: 'error'
        }).catch(this.swal.noop)
      }
    },

    props: {
      articleId: {
        required: true,
        type: String
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
