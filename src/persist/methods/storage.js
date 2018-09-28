export default (storage) => ({

  set: (key, data, callback) => {
    const stringified = JSON.stringify(data)
    storage.setItem(key, stringified)
    callback && callback()
  },

  get: (key, callback) => {
    const data = storage.getItem(key)
    const parsed = JSON.parse(data)
    callback && callback(parsed)
  },

  remove: (key, callback) => {
    storage.removeItem(key)
    callback && callback()
  },

})