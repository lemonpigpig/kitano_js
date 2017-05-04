<template lang="html">
  <div class="User__Name">
    <div class="User__Key" v-html="'Name'"/>

    <div class="User__Val" v-if="owned && canEdit">
      <div class="Editable hint--right" :aria-label="label">
        <span contenteditable
              id="editable_name"
              data-ph="Your name is required"
              v-on:blur="cancel"
              v-html="fields.name.value"
              :class="userNameClass"
              @keydown.13="change"
              @keydown.27="cancel"
              @click="editing"/>
      </div>
    </div>

    <div class="User__Val" v-html="profile.name" v-else/>

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
      this.fields.name.value = this.storedUser.name
    },

    computed: {
      ...mapGetters('users', ['storedUser']),

      canEdit () {
        return !this.$store.state.editingField || this.$store.state.editingField === 'name'
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

      userNameClass () {
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
          name: {
            errors: [],
            value: '',
            validation: {
              required: true,
              type: 'name'
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
      ...mapMutations('users', ['setName']),

      cancel (e) {
        document.execCommand('undo')
        e.target.blur()
        this.isEditing = false
        this.unsetEditingField() // @vuex mutation
      },

      change (e) {
        let name = e.target.innerText.trim()

        e.target.blur()
        e.preventDefault()
        this.fields.name.value = name
        this.error = ''

        if (this.hasInvalidData()) { return false }

        this.setPayload()

        axios.post(`${process.env.apiUrl}users/${this.storedUser.slug}`, this.payload)
          .then((r) => { this.vuexUser() })
          .catch((e) => { this.error = e.response.data['name'][0] })
      },

      cleanUp () {
        this.unsetEditingField() // @vuex mutation
        this.name = ''
      },

      editing () {
        this.isEditing = true
        this.setEditingField('name') // @vuex mutation - tell siblings to cancel whatever they are doing
      },

      hasInvalidData () {
        this.fields = this.validate(this.fields) // @vue-validation
        this.error = this.stringifyValidationErrors(this.fields) // @vue-validation

        return this.validationHasErrors(this.fields) // @vue-validation
      },

      setPayload () {
        this.payload = { '_method': 'PATCH', name: this.fields.name.value.trim() }
      },

      vuexUser () {
        this.setName(this.payload.name) // @vuex mutation
        this.saveUser() // @vuex action
        this.error = this.checkMark('Name updated') // @vue-mixins
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
