<template lang="html">
  <div class="Comment__Footer">
    <comm-likes :comment="comment" :articleId="articleId"/>

    <comm-tools v-if="owned"
                :commentIndex="commentIndex"
                :comment="comment"
                :articleId="articleId"/>
  </div>
</template>


<script type='text/javascript'>
  import commLikes from '~components/_comments/_comment-likes.vue'
  import commTools from '~components/_comments/_comment-tools.vue'

  export default {
    components: { commLikes, commTools },

    props: {
      articleId: {
        required: true,
        type: String
      },
      comment: {
        required: true,
        type: Object
      },
      commentIndex: {
        required: true,
        type: Number
      },
      owned: {
        required: true,
        type: Boolean
      }
    }
  }
</script>
