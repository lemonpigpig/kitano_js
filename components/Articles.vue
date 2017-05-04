<template lang="html">
  <div :class="artclass" v-if="article">
    <div class="Article__Heading">
      <div class="Article__Heading_link">
        <nuxt-link :to="{
          path: `/articles/${article.slug}`,
          params: {slug: article.slug}}">{{ article.title }}
        </nuxt-link>
      </div>

      <div class="Article__Heading_text Pg-header">
        {{ article.subtitle }}
      </div>
    </div>

    <div class="Article__Content">
      <div class="Article__Content_partial" v-if="! article.content">
        <p v-html="article.teaser"/>
      </div>

      <div class="Article__Content_partial" v-if="article._snippetResult">
        <p v-html="'[...] ' + article._snippetResult.body.value + ' [...]'"/>
      </div>
    </div>

    <div class="Article__Footer">
      <div class="Article__Footer_top">
        <icon-tags :article="article"/>
      </div>

      <div class="Article__Footer_bottom">
        <icon-dates :humanized="false" :article="article"/>

        <icon-likes :article="article"/>

        <icon-comments :article="article"/>
      </div>
    </div>
  </div>
</template>


<script type="text/javascript">
  import iconComments from '~components/_articles/_icon_comments.vue'
  import iconDates from '~components/_articles/_icon_dates.vue'
  import iconLikes from '~components/_articles/_icon_likes.vue'
  import iconTags from '~components/_articles/_icon_tags.vue'

  export default {
    components: { iconComments, iconDates, iconLikes, iconTags },

    computed: {
      artclass () {
        let aDate = this.digitizeDate(this.article.created) // @vue-mixins
        let base = 'Articles__List Article Article_'

        return `${base}${aDate}`
      }
    },

    name: 'ListedArticle',

    props: {
      article: {
        required: true,
        type: Object
      }
    }
  }
</script>
