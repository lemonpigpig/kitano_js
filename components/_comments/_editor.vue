<template lang="html">
  <div class="Editor">
    <div class="Editor__Body">
      <textarea class="Editor__Markdown"
                name="user_comment"
                placeholder="Type in your comment..."
                v-show="isMarkdown"
                :value="md"
                @input="updtMarkdown"
                @keyup.esc="cancel"
      ></textarea>

      <div class="Editor__Preview" v-html="compiled" v-show="! isMarkdown"/>
    </div>

    <div class="Editor__Footer">
      <button type="submit"
              :disabled="submitting"
              :class="submitClass"
              @click.prevent="submit"
              v-html="buttonText"/>

      <button class="Editor__Toggle"
              @click.prevent="toggleView"
              v-html="mdText"/>

      <div class="Editor__Footer_right">
          <small>Use <a target="_blank"
                        href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">Markdown</a
                     > to format your comment</small
          >
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
  const AutoSize = require('autosize')
  const mkd = require('markdown-it')('commonmark').use(require('markdown-it-highlightjs'))

  import axios from 'axios'
  import { debounce } from 'lodash'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeDestroy () {
      let ta = document.querySelector('textarea')
      if (ta) {
        ta.removeEventListener('focus', function () { AutoSize(ta) })
      }
    },

    beforeMount () {
      this.input = this.storedComments[this.commentIndex].body
    },

    data () {
      return {
        input: '',
        isMarkdown: true,
        submitting: false,
        oldComment: {}
      }
    },

    computed: {
      ...mapGetters('comments', ['editingComment', 'commentIndex', 'storedComments']),

      buttonText () {
        return this.submitting ? 'Working' : 'Update'
      },

      canEdit () {
        return this.isEditing && (this.editingComment === this.comment.id)
      },

      comment () {
        return this.storedComments[this.commentIndex]
      },

      compiled () {
        return mkd.render(this.input)
      },

      isEditing () {
        return this.editingComment !== false
      },

      md () {
        return this.input
      },

      mdText () {
        return this.isMarkdown ? 'Preview' : 'Markdown'
      },

      submitClass () {
        let submitting = this.submitting ? ' Button_pulse' : ''
        return `Button Button_green${submitting}`
      }
    },

    methods: {
      ...mapMutations('comments', ['unsetEditingComment', 'setComments']),

      cacheOldComment () {
        this.oldComment.body = this.comment.body
        this.oldComment.created = this.comment.created
        this.oldComment.idx = this.commentIndex
      },

      cancel () {
        this.input = ''
        this.submitting = false
        this.unsetEditingComment()
      },

      finish () {
        this.input = ''
        this.submitting = false
      },

      restoreComment () {
        let oldComments = this.storedComments

        oldComments[this.oldComment.idx].body = this.oldComment.body
        oldComments[this.oldComment.idx].created = this.oldComment.created

        this.setComments(oldComments)

        this.swal({
          title: 'Error',
          text: 'Unable to update your comment. Please, try again later.',
          type: 'error'
        }).catch(this.swal.noop)

        this.submitting = false
      },

      toggleView () {
        this.isMarkdown = !this.isMarkdown
      },

      submit () {
        if (!this.input.length || this.submitting) { return false }

        this.submitting = true
        this.cacheOldComment()

        this.comment.body = this.md
        this.comment.updated = Date.now()

        let data = { body: this.input, '_method': 'PATCH' }

        axios.post(`${process.env.articlesUrl}/${this.slug}/comments/${this.editingComment}`, data)
          .then((r) => { this.finish() })
          .catch((e) => { this.restoreComment() })

        this.unsetEditingComment()
      },

      updtMarkdown: debounce(
        function (e) {
          this.input = e.target.value
        }, 300
      )
    },

    mounted () {
      let ta = document.querySelector('textarea')
      if (ta) {
        ta.addEventListener('focus', function () { AutoSize(ta) })
      }
    },

    props: {
      slug: {
        required: true,
        type: String
      }
    },

    watch: {
      'isMarkdown' () {
        if (this.isMarkdown) {
          setTimeout(() => {
            document.querySelector('textarea').focus()
          }, 0)
        }
      }
    }
  }
</script>
