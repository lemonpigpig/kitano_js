<template lang="html">
  <section class="Article-view">
    <h1 v-if="article" class="Pg-header">{{ article.title }}</h1>

    <app-error :error="error" v-if="error"/>

    <app-article v-if="article" :article="article"/>
  </section>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import appArticle from '~components/Article.vue'
  import appError from '~components/app-error.vue'
  import { mapGetters } from 'vuex'

  export default {
    asyncData ({ params, store }) {
      let axiosAuth = axios.defaults.headers.common['Authorization']
      let token = store.getters['users/storedUser'].access_token
      let needsHeader = axiosAuth === undefined && store.getters['users/storedUser'].authenticated && token

      if (needsHeader) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}` }

      return axios.get(`${process.env.articlesUrl}/${params.slug}`)
        .then((r) => { return { article: r.data.article, error: false } })
        .catch((e) => { return { article: false, error: { status: '500', message: 'Could not load article.' } } })
    },

    beforeMount () {
      this.checkAxiosAuthorizationHeader() // @vue-mixins
    },

    components: { appArticle, appError },

    computed: {
      ...mapGetters('users', ['storedUser']),

      authed () {
        return this.storedUser.authenticated
      }
    },

    head () {
      return {
        title: this.article.title,
        meta: [{ hid: 'description', name: 'description', content: this.article.subtitle }],
        link: [{ rel: 'canonical', href: process.env.baseUrl + this.$route.path }]
      }
    },

    methods: {
      fetchData () {
        axios.get(`${process.env.articlesUrl}/${this.$route.params.slug}`)
          .then((r) => {
            this.article = r.data.article
            this.error = false
          })
          .catch((e) => {
            this.article = false
            this.error = { status: '500', message: 'Could not load article.' }
          })
      }
    },

    name: 'SingleArticle',

    watch: {
      'authed' () {
        this.fetchData()
      }
    }
  }
</script>
