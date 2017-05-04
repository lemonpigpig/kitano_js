<template lang="html">
  <div class="User__Bio">
    <div class="User__Key" v-html="'Bio'"/>

    <div class="User__Val" v-if="owned && editable">
      <div class="Editable hint--right" :aria-label="label">
        <span contenteditable
              id="editable_name"
              data-ph="Tell us something about you..."
              v-on:blur="cancel"
              v-html="fields.bio.value"
              :class="userBioClass"
              @keydown.13="change"
              @keydown.27="cancel"
              @click="editing"
        ></span>
      </div>
    </div>

    <div class="User__Val" v-else v-html="user.bio"/>

    <div class="User__Error" v-html="error"/>
  </div>
</template>


<script type="text/javascript">
  import axios from 'axios'
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    beforeDestroy () {
      this.cleanUp()
    },

    beforeMount () {
      this.fields.bio.value = this.storedUser.bio
    },

    computed: {
      ...mapGetters('users', ['storedUser']),

      editable () {
        return !this.$store.state.editingField || this.$store.state.editingField === 'bio'
      },

      label () {
        return this.isEditing ? 'Hit Enter to Submit. Esc to  cancel' : 'Click to Change'
      },

      owned () {
        return this.storedUser.slug === this.$route.params.slug
      },

      user () {
        return this.owned ? this.storedUser : this.profile
      },

      userBioClass () {
        let base = 'Editable__content'
        let edit = !this.isEditing ? '' : ` ${base}_editing`
        let err = !this.error === '' ? '' : ` ${base}_error`

        return `${base}${edit}${err}`
      }
    },

    data () {
      return {
        error: '',
        fields: {
          bio: {
            errors: [],
            value: '',
            validation: {
              required: false,
              type: 'bio'
            }
          }
        },
        payload: {},
        isEditing: false
      }
    },

    methods: {
      ...mapActions('users', ['saveUser']),
      ...mapMutations('profile', ['setEditingField', 'unsetEditingField']),
      ...mapMutations('users', ['setBio']),

      cancel (e) {
        document.execCommand('undo')
        e.target.blur()
        this.isEditing = false
        this.unsetEditingField()
      },

      change (e) {
        let bio = e.target.innerText.trim()

        e.target.blur()
        e.preventDefault()
        this.fields.bio.value = bio
        this.error = ''

        if (this.hasInvalidData()) { return false }

        this.setPayload()

        axios.post(`${process.env.apiUrl}users/${this.storedUser.slug}`, this.payload)
          .then((r) => { this.vuexUser() })
          .catch((e) => { this.error = e.response.data['bio'][0] })
      },

      cleanUp () {
        this.unsetEditingField()
        this.fields.bio.value = ''
      },

      editing () {
        this.isEditing = true
        this.setEditingField('bio') // tell siblings to cancel whatever they are doing
      },

      hasInvalidData () {
        this.fields = this.validate(this.fields) // @vue-validation
        this.error = this.stringifyValidationErrors(this.fields) // @vue-validation

        return this.validationHasErrors(this.fields) // @vue-validation
      },

      setPayload () {
        this.payload = { '_method': 'PATCH', bio: this.fields.bio.value.trim() }
      },

      vuexUser () {
        this.setBio(this.payload.bio) // @vuex mutation
        this.saveUser() // @vuex action
        this.error = this.checkMark('Bio updated')
        setTimeout(() => { this.error = '' }, 3000)
      }
    },

    props: {
      profile: {
        required: true,
        type: Object
      }
    }
  }
</script>
