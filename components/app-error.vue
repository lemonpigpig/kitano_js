<template lang="html">
  <div class="Error-page">
    <div class="Error-page__Container" v-if="e">
      <h1 class="Error-page__Message">
        {{ e.status + ' - '}}{{ e.message }}
      </h1>

      <div class="Error-page__Info" v-if="error.message == 'Network Error' || error.status == '500'">
        <h2>Please try again (Press F5)</h2>
      </div>

      <div class="Error-page__Info" v-if="error.statusCode === 404">
        <nuxt-link class="Error-page_link" to="/">Back to Home page</nuxt-link>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
export default {
  head () {
    return {
      title: this.error.message || 'An error occured'
    }
  },

  data () {
    if (this.error.response) {
      return {
        e: {
          message: this.error.response.data.message,
          status: this.error.response.status
        }
      }
    }

    return {
      e: this.error
    }
  },

  name: 'Error',

  props: ['error']
}
</script>
