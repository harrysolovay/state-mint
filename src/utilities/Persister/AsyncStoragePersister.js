export default class AsyncStoragePersister {

  constructor(strategy) {
    this.strategy = strategy
  }

  set = (key, data, callback) => {
    const stringified = JSON.stringify(data)
    this.strategy.setItem(key, stringified, callback)
  }

  get = (key, callback) => {
    this.strategy.getItem(key, (data) => {
      const parsed = JSON.parse(data)
      if (callback) callback(parsed)
    })
  }

  remove = (key, callback) => {
    this.strategy.removeItem(key, () => {
      if(callback) callback()
    })
  }

}