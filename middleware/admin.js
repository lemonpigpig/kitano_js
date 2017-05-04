export default function ({ store, redirect, error }) {
  if (!store.getters['users/storedUser'].admin) {
    error({
      message: 'Sorry, that\'s a No-No',
      statusCode: 403
    })
  }
}
