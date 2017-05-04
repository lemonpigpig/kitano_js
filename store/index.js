export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    commit('users/setUser', req.session.user || false)
  }
}
