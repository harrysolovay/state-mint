export default (strategy) => ({

  set: (key, data, callback) => {
    const stringified = JSON.stringify(data)
    strategy.setItem(key, stringified, callback)
  },

  get: (key, callback) => {
    strategy.getItem(key, (data) => {
      const parsed = JSON.parse(data)
      if (callback) callback(parsed)
    })
  },

  remove: (key, callback) => {
    strategy.removeItem(key, () => {
      if(callback) callback()
    })
  },

})