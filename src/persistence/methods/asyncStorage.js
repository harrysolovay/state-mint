export default (AsyncStorage) => ({

  set: (key, data, callback) => {
    const stringified = JSON.stringify(data)
    AsyncStorage.setItem(key, stringified, callback)
  },

  get: (key, callback) => {
    AsyncStorage.getItem(key, (data) => {
      const parsed = JSON.parse(data)
      callback && callback(parsed)
    })
  },

  remove: (key, callback) => {
    AsyncStorage.removeItem(key, () => {
      callback && callback()
    })
  },

})