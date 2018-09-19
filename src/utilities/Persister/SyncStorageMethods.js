export default class SyncStorageMethods {

  constructor(strategy) {
    this.strategy = strategy
  }

  set = (key, data, callback) => {
    const stringified = JSON.stringify(data)
    this.strategy.setItem(key, stringified)
    if (callback) callback()
  }

  get = (key, callback) => {
    const data = this.strategy.getItem(key)
    const parsed = JSON.parse(data)
    if (callback) callback(parsed)
  }

  remove = (key, callback) => {
    this.strategy.removeItem(key)
    if (callback) callback()
  }

}