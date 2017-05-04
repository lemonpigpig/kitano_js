export default function ({ store, redirect, error }) {
  if (!store.getters['users/storedUser'].authenticated) {
    error({
      message: 'Login required to access this page.',
      statusCode: 403
    })
  }
}
