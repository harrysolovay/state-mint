import { forOf } from '~/utilities'
import setPersistence from '~/persist'

export default (config, stores = {}) => {
  forOf(config, (key) => {

    class Store extends config[key] {

      $ = stores
  
      _key = key
      _subscribers = {}
  
      persist(config) {
        if (config) {
          this._persistence = {}
          setPersistence(this, key, config)
        } else {
          const { _persistence } = this
          if (_persistence) {
            _persistence.trigger()
          }
        }
      }
  
      async setState(updater, callback) {
  
        const { state: lastState } = this
  
        const newState = typeof updater === 'function'
          ? updater(lastState)
          : updater
  
        const a = JSON.stringify(lastState)
        const b = JSON.stringify(newState)
  
        if (a === b) {
          callback && callback()
          return
        }
  
        this.state = Object.assign({},
          lastState,
          newState,
        )
  
        const { _persistence } = this
        if (_persistence) {
          const { referencesState, trigger } = _persistence
          referencesState && trigger()
        }
  
        const { _subscribers } = this
  
        const subscribersExist = (() => {
          for (let key in _subscribers) {
            if (_subscribers.hasOwnProperty(key)) {
              return true
            }
          }
          return false
        })()
  
        if (subscribersExist) {
          const pending = Object
            .values(_subscribers)
            .map(({ rerender }) => rerender())
          await Promise.all(pending)
        }
  
        callback && callback()
  
      }
    }

    stores[key] = new Store()
  })

  return stores
}