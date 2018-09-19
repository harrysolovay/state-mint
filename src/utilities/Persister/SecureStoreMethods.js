export default class SecureStorageMethods {

  constructor(strategy, options) {
    this.strategy = strategy
    this.options = options
  }

  set = async (key, data, callback) => {
    const stringified = JSON.stringify(data)
    await this.strategy.setItemAsync(key, stringified, this.options)
    callback && callback()
  }

  get = async (key, callback) => {
    const data = await this.strategy.getItemAsync(key, options)
    const parsed = JSON.parse(data)
    callback && callback(parsed)
  }

  remove = async (key, callback) => {
    await this.strategy.deleteItemAsync(key, options)
    callback && callback()
  }

}