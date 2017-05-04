require('dotenv').config()

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Sam Kitano',
    noscript: [{ innerHTML: 'This website requires JavaScript.' }],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      { name: 'author', content: 'Samuel Caetano' },
      { hid: 'robots', name: 'robots', content: 'INDEX,FOLLOW,NODIR,NOOP' },
      { hid: 'description', name: 'description', content: 'Personal website made with Vue.js and Laravel' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: process.env.BASE_URL + '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Inconsolata|Open+Sans:300,300i,400,400i,600,600i' }
    ]
  },

  /*
  ** Global CSS
  */
  css: ['~assets/css/app.min.css'],

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#4DBA87' },

  /*
  ** Vendor build
  */
  build: {
    extend (config) { config.node = { fs: 'empty' } },
    vendor: [
      'autosize',
      'axios',
      'dotenv',
      'markdown-it',
      'markdown-it-highlightjs',
      'sweetalert2'
    ]
  },

  plugins: [
    '~plugins/vue-filters.js',
    '~plugins/vue-mixins.js',
    '~plugins/vue-sweetalert.js',
    '~plugins/vue-validation.js'
  ],

  transition: 'fade',

  router: {
    linkActiveClass: 'active'
  },

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    apiUrl: process.env.API_URL,
    apiTokenUrl: process.env.API_TOKEN_URL,
    apiRegisterUrl: process.env.API_REGISTER_URL,
    apiConfirmUrl: process.env.API_CONFIRM_URL,
    apiContactUrl: process.env.API_CONTACT_URL,
    apiResendUrl: process.env.API_RESEND_URL,
    articlesUrl: process.env.API_ARTICLES_URL,
    clientSecret: process.env.CLIENT_SECRET,
    grantType: process.env.GRANT_TYPE,
    clientId: process.env.CLIENT_ID
  },

  server: {
    extend: function (app) {
      // app is an express application
      app.use('express-session')
    }
  }
}
