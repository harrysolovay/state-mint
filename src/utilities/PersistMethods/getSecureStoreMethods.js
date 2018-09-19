export default (strategy, options) => ({

  set: async (key, data, callback) => {
    const stringified = JSON.stringify(data)
    await strategy.setItemAsync(key, stringified, options)
    callback && callback()
  },

  get: async (key, callback) => {
    const data = await strategy.getItemAsync(key, options)
    const parsed = JSON.parse(data)
    callback && callback(parsed)
  },

  remove: async (key, callback) => {
    await strategy.deleteItemAsync(key, options)
    callback && callback()
  },

})