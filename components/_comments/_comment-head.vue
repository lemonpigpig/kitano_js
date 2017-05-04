<template lang="html">
  <div class="Comment__Head">
    <div class="Comment__Head_left" v-if="comment.author.avatar">
	     <img :src="comment.author.avatar" :alt="imgalt">
	  </div>

    <div class="Comment__Head_left" v-else>
      <avatar/>
    </div>

		<div class="Comment__Head_right">
			<div class="Comment__Heading__Username" v-if="comment.author.name">
				<nuxt-link :to="{ path: `/users/${comment.author.slug}`, params: { user: comment.author.slug } }">
					<strong>{{ comment.author.name }}</strong>
				</nuxt-link>
			</div>

      <div class="Comment__Heading__Username" v-html="'A User'" v-else/>

			<div class="Comment__Dates">
				<p>
					<span class="Comment__Created">
						<small>Posted {{ comment.created | dateTimeFormat }}</small>
					</span>

					<br/>

					<span class="Comment__Updated" v-if="edited">
						<small>Updated {{ comment.updated | dateTimeFormat }}</small>
					</span>
				</p>
			</div>
		</div>
  </div>
</template>


<script type="text/javascript">
  import avatar from '~components/_icons/_avatar.vue'

  export default {
    components: { avatar },

    computed: {
      imgalt () {
        return this.comment.author.name || 'Please login'
      },

      edited () {
        return this.comment.created !== this.comment.updated
      }
    },

    props: {
      comment: {
        required: true,
        type: Object
      }
    }
  }
</script>
