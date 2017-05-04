<template lang="html">
  <div class="Error-page">
    <div class="Error-page__Container">
      <h1 class="Error-page__Message" v-if="isConn">
        ERROR: API appears to be down
      </h1>

      <h1 class="Error-page__Message" v-else>
        {{ e.statusCode }} -  {{ e.message }}
      </h1>

      <div class="Error-page__Info" v-if="e.message == 'Network Error' || e.statusCode == 500">
        <h2>Please try again (Press F5)</h2>
      </div>

      <div class="Error-page__Info" v-if="e.statusCode === 404">
        <nuxt-link class="Error-page_link" to="/">Back to Home page</nuxt-link>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
  import { words } from 'lodash'

  export default {
    computed: {
      e () {
        return this.error
      },

      isConn () {
        if (this.e.statusCode !== 500) { return false }

        let w = words(this.e.message)

        if (w[0] === 'connect') { return true }
      }
    },

    head () {
      return {
        title: 'Error'
      }
    },

    name: 'Error',

    props: ['error']
  }
</script>
