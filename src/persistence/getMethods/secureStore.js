export default (SecureStore, options) => ({

  set: (key, data, callback) => {
    (async () => {
      if (data) {
        const stringified = JSON.stringify(data)
        await SecureStore.setItemAsync(key, stringified, options)
        callback && callback()
      }
    })()
  },

  get: (key, callback) => {
    (async () => {
      const data = await SecureStore.getItemAsync(key, options)
      if (data) {
        const parsed = JSON.parse(data)
        callback && callback(parsed)
      }
    })()
  },

  remove: (key, callback) => {
    (async () => {
      await SecureStore.deleteItemAsync(key, options)
      callback && callback()
    })()
  },

})