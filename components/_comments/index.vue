<template lang="html">
  <section class="Comments" v-if="storedComments">
    <h1 class="Pg-header">Comments
      <span>({{ commentCount }})</span>
    </h1>

    <comment v-for="(comment, index) in storedComments"
             :key="comment.id"
             :comment="comment"
             :commentIndex="index"
             :article="article"/>

    <new-comm v-if="commentable" :article="article"/>
  </section>

  <section class="Comments" v-else>
    <app-error :error="error"/>
  </section>
</template>


<script type="text/javascript">
  import appError from '~components/app-error.vue'
  import axios from 'axios'
  import comment from '~components/_comments/_comment.vue'
  import newComm from '~components/_comments/_new-comment.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeMount () { this.fetchData() },

    components: { appError, comment, newComm },

    computed: {
      ...mapGetters('comments', ['storedComments', 'commentCount']),
      ...mapGetters('users', ['storedUser']),

      authed () {
        return this.storedUser.authenticated
      },

      authenticating () {
        return this.storedUser.registering
      },

      commentable () {
        return this.authed && !this.authenticating
      }
    },

    data () {
      return {
        error: false
      }
    },

    methods: {
      ...mapMutations('comments', ['setComments']),

      fetchData () {
        axios.get(`${process.env.articlesUrl}/${this.$route.params.slug}/comments`)
          .then((r) => { this.setComments(r.data.comments) })
          .catch((e) => { this.error = { status: '', message: 'Could not load comments.' } })
      }
    },

    name: 'Comments',

    props: {
      article: {
        required: true,
        type: Object
      }
    },

    watch: {
      'storedUser' () {
        this.fetchData()
      }
    }
  }
</script>
