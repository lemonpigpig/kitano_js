import axios from 'axios'

export const actions = {
  logout () { axios.post('/api/logout') },

  saveUser ({ state }) {
    let token = false

    if (state.user.access_token) { token = state.user.access_token }
    if (token) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}` }

    axios.post('/api/user', { user: state.user })
  }
}

export const getters = {
  storedUser: state => state.user
}

export const mutations = {
  incrementAttempts (state) { state.user.attempts++ },
  setAttempts (state, count) { state.user.attempts = count },
  setAuthed (state, status) { state.user.authenticated = status },
  setAvatar (state, avatar) { state.user.avatar = avatar },
  setBio (state, bio) { state.user.bio = bio },
  setName (state, name) { state.user.name = name },
  setEmail (state, email) { state.user.email = email },
  setPw (state, pw) { state.user.pw = pw },
  setRegistering (state, status) { state.user.registering = status },
  setResetting (state, status) { state.user.resetting = status },
  setUser (state, user) { state.user = user },
  setFreeze (state, time) { state.user.freeze = time }
}

export const state = {
  user: {}
}
