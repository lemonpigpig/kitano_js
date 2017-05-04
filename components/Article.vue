<template lang="html">
  <article :class="articleClass">
    <div class="Article__Heading_text Pg-header">
      {{ article.subtitle }}
    </div>

    <hr class="article">

    <div class="Article__Content_full">
      {{ article.content }}
    </div>

    <hr class="article">

    <div class="Article__Footer">
      <div class="Article__Footer_top">
        <icon-tags :article="article"/>
      </div>

      <div class="Article__Footer_bottom">
        <icon-dates :article="article" :humanized="true"/>

        <icon-likes :article="article"/>

        <icon-comments :article="article"/>
      </div>
    </div>

    <div class="Toggle__Button">
      <transition name="fade">
        <button @click="toggleComments"
                class="Button Button_green"
                type="button"
                name="button"
                v-html="buttonText"
                v-show="commentCount"/>
      </transition>
    </div>

    <transition name="fade">
      <comments :article="article" v-show="showComments"/>
    </transition>
  </article>
</template>


<script type="text/javascript">
  import comments from '~components/_comments/index.vue'
  import iconComments from '~components/_articles/_icon_comments.vue'
  import iconDates from '~components/_articles/_icon_dates.vue'
  import iconLikes from '~components/_articles/_icon_likes.vue'
  import iconTags from '~components/_articles/_icon_tags.vue'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    beforeDestroy () {
      this.resetComments()
    },

    components: { comments, iconComments, iconDates, iconLikes, iconTags },

    computed: {
      ...mapGetters('comments', ['commentCount']),

      articleClass () {
        return 'Article Article_' + this.digitizeDate(this.article.created) // @vue-mixins
      }
    },

    data () {
      return {
        buttonText: 'Show Comments',
        showComments: false
      }
    },

    methods: {
      ...mapMutations('comments', ['resetComments']),

      toggleComments () {
        this.showComments = !this.showComments
      }
    },

    name: 'Article',

    props: {
      article: {
        required: true,
        type: Object
      }
    },

    watch: {
      'showComments' () {
        this.buttonText = this.showComments ? 'Hide Comments' : 'Show Comments'
      }
    }
  }
</script>
