export default (strategy) => ({

  set: (key, data, callback) => {
    const stringified = JSON.stringify(data)
    strategy.setItem(key, stringified)
    if (callback) callback()
  },

  get: (key, callback) => {
    const data = strategy.getItem(key)
    const parsed = JSON.parse(data)
    if (callback) callback(parsed)
  },

  remove: (key, callback) => {
    strategy.removeItem(key)
    if (callback) callback()
  },

})