export const getters = {
  commentCount: state => state.comments.length,
  commentIndex: state => state.commentIndex,
  editingComment: state => state.editingComment,
  storedComments: state => state.comments
}

export const mutations = {
  addComment (state, comment) { state.comments.push(comment) },
  resetComments (state) { state.comments = [] },
  setCommentIndex (state, idx) { state.commentIndex = idx },
  setComments (state, comments) { state.comments = comments },
  setEditingComment (state, id) { state.editingComment = id },

  unsetEditingComment (state) {
    state.editingComment = false
    state.commentIndex = false
  }
}

export const state = {
  commentIndex: false,
  comments: [],
  editingComment: false
}
