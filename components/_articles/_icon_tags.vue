<template lang="html">
  <div class="Article__Footer__Icon Article__Footer__Icon_tags" v-if="article.tags.length">
		<div class="Tags">
			<ul class="Tags__List">
				<li :class="tagClass(tag)"
				    v-for="tag in tags"
				    ><nuxt-link :to="{ path: `/articles/tagged/${tag}`, params: {id: tag} }">{{ tag }}</nuxt-link
        ></li>
			</ul>
		</div>
	</div>
</template>


<script type="text/javascript">
  export default {
    computed: {
      tags () {
        return this.sortAndPutFirst(this.article.tags.split(','), this.$route.params.id) // @vue-mixins
      }
    },

    methods: {
      tagClass (tag) {
        return 'Tag Tag_' + tag.trim().toLowerCase()
      }
    },

    props: {
      article: {
        required: true,
        type: Object
      }
    }
  }
</script>
