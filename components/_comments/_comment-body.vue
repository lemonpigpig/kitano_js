<template lang="html">
    <div class="Comment__Body"
         v-html="body"
         v-if="show"/>
</template>


<script type="text/javascript">
  const md = require('markdown-it')('commonmark').use(require('markdown-it-highlightjs'))

  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters('comments', ['editingComment']),

      body () {
        return md.render(this.comment.body)
      },

      show () {
        return this.editingComment !== this.comment.id
      }
    },

    props: {
      comment: {
        required: true,
        type: Object
      }
    }
  }
</script>
