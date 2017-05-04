<template lang="html">
  <section class="Articles" v-if="articles">
    <h1 class="Pg-header">Articles tagged "{{ $route.params.id }}"
      <span>({{ articles.length }})</span>
    </h1>

    <app-error :error="error" v-if="error"/>

    <div class="Articles__List">
      <app-articles v-for="article in articles" :article="article" :key="article.slug"/>
    </div>
  </section>
</template>


<script type="text/javascript">
  import appArticles from '~components/Articles.vue'
  import appError from '~components/app-error.vue'
  import axios from 'axios'
  import { mapGetters } from 'vuex'

  export default {
    asyncData ({ params }) {
      return axios.get(`${process.env.articlesUrl}/tagged/${params.id}`)
        .then((r) => { return { articles: r.data.articles, error: false } })
        .catch((e) => { return { articles: false, error: { status: '500', message: 'Could not load articles.' } } })
    },

    beforeMount () {
      this.checkAxiosAuthorizationHeader() // @vue-mixins
    },

    components: { appArticles, appError },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authed () {
        return this.storedUser.authenticated
      }
    },

    head () {
      return {
        title: 'Tagged Articles',
        meta: [{ hid: 'description', name: 'description', content: `Articles tagged ${this.$route.params.id}` }],
        link: [{ rel: 'canonical', href: `${process.env.baseUrl}${this.$route.path}` }]
      }
    },

    methods: {
      fetchData () {
        axios.get(`${process.env.articlesUrl}/tagged/${this.$route.params.id}`)
          .then((r) => {
            this.articles = r.data.articles
            this.error = false
          })
          .catch((e) => {
            this.articles = false
            this.error = { status: '500', message: 'Could not load articles.' }
          })
      }
    },

    name: 'TaggedArticlesList',

    watch: {
      'authed' () {
        this.fetchData()
      }
    }
  }
</script>
