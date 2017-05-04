<template lang="html">
  <div class="Editor">
    <h1 class="Pg-header">Your Comment</h1>

    <div class="Editor__Body">
      <textarea id="new_user_comment"
                class="Editor__Markdown"
                name="new_user_comment"
                placeholder="Type in your comment..."
                v-show="isMarkdown"
                :disabled="! isNotEditing || submitting"
                :value="md"
                @input="updtMarkdown"
      ></textarea>

      <div class="Editor__Preview" v-html="compiled" v-show="! isMarkdown"/>
    </div>

    <div class="Editor__Footer">
      <button type="submit"
              v-html="buttonText"
              :class="submitClass"
              :disabled="submitting || ! isNotEditing"
              @click.prevent="submit"
      ></button>

      <button class="Editor__Toggle"
              v-html="mdText"
              :disabled="! isNotEditing"
              @click.prevent="toggleView"
      ></button>

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

    computed: {
      ...mapGetters('users', ['storedUser']),
      ...mapGetters('comments', ['editingComment']),

      buttonText () {
        return this.submitting ? 'Working' : 'Post'
      },

      compiled () {
        return mkd.render(this.input)
      },

      isNotEditing () {
        return this.editingComment === false
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

    data () {
      return {
        input: '',
        isMarkdown: true,
        submitting: false,
        newComment: false
      }
    },

    methods: {
      ...mapMutations('comments', ['addComment']),

      alertError () {
        this.swal({
          title: 'Error!',
          text: 'Unable to post comment. Please try again.',
          type: 'error'
        }).catch(this.swal.noop)

        this.submitting = false
      },

      submit () {
        if (!this.input.length || this.submitting) {
          this.focus('new_user_comment') // @vue-mixins
          return false
        }

        this.submitting = true

        let payload = { body: this.input }

        axios.post(`${process.env.articlesUrl}/${this.article.slug}/comments`, payload)
          .then((r) => { this.newComment = r.data.comment })
          .catch((e) => { this.alertError() })
      },

      toggleView () {
        this.isMarkdown = !this.isMarkdown
      },

      updateData () {
        let user = this.storedUser.slug
        let userHasComments = this.isDefined(this.article.comments.users, user) // @vue-mixins

        this.input = ''
        this.submitting = false
        this.article.comments.total++

        userHasComments ? this.article.comments.users[user]++ : this.article.comments.users[user] = 1

        this.addComment(this.newComment)
      },

      updtMarkdown: debounce(function (e) { this.input = e.target.value }, 300)
    },

    mounted () {
      let ta = document.querySelector('textarea')
      if (ta) {
        ta.addEventListener('focus', function () { AutoSize(ta) })
      }
    },

    props: {
      article: {
        required: true,
        type: Object
      }
    },

    watch: {
      'newComment' () {
        this.updateData()
      },

      'isMarkdown' () {
        if (this.isMarkdown) {
          setTimeout(() => {
            this.focus('new_user_comment') // @vue-mixins
          }, 0)
        }
      }
    }
  }
</script>
