export const getters = { getEvent: state => state.evt }

export const mutations = {
  setEvent (state, evt) { state.evt = evt },
  unsetEvents (state) { state.evt = false }
}

export const state = { evt: false }
