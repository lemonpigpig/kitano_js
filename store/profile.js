export const getters = {
  editingField: state => state.editingField,
  cancelEdit: state => state.cancelEdit,
  changedEmail: state => state.changedEmail,
  changedPw: state => state.changedPw
}

export const mutations = {
  setCancelEdit (state, item) { state.cancelEdit = item },
  setChangedEmail (state, status) { state.changedEmail = status },
  setChangedPw (state, status) { state.changedPw = status },
  setEditingField (state, field) { state.editingField = field },
  unsetCancelEdit (state) { state.cancelEdit = false },
  unsetEditingField (state) { state.editingField = false }
}

export const state = {
  cancelEdit: false,
  changedEmail: false,
  changedPw: false,
  editingField: false
}
