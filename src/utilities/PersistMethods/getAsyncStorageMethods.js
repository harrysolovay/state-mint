// @flow

export default (strategy: typeof AsyncStorage) => ({

  set: (key: string, data: any, callback?: () => void): void => {
    const stringified = JSON.stringify(data)
    strategy.setItem(key, stringified, callback)
  },

  get: (key: string, callback?: (any) => void): void => {
    strategy.getItem(key, (data: any) => {
      const parsed = JSON.parse(data)
      if (callback) callback(parsed)
    })
  },

  remove: (key: string, callback?: () => void): void => {
    strategy.removeItem(key, () => {
      if(callback) callback()
    })
  },

})