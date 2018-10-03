import error, {
  STORE_KEY_ALREADY_EXISTS,
} from '~/errors'
import setPersistence from '~/persistence'

export default (stores, consumers, config) => {

  for (let key in config) {
    if (config.hasOwnProperty(key)) {

      error(!!stores[key], STORE_KEY_ALREADY_EXISTS)

      class Store extends config[key] {

        constructor() {
          super()

          Object.assign(this, {
            $: stores,
            _key: key,
            _subscribers: {},
          })

          this.persistence &&
            setPersistence(this, key)

        }

        rerender() {

          const { _subscribers } = this

          return Object.keys(_subscribers).length >= 1
            ? Promise.all(
                Object
                  .values(_subscribers)
                  .map(({ rerender }) => rerender())
              )
            : Promise.resolve()

        }
    
        async setState(updater, callback) {
    
          const { state: lastState } = this
    
          const newState = Object.assign({},
            lastState,
            typeof updater === 'function'
              ? updater(lastState)
              : updater,
          )
    
          const a = JSON.stringify(lastState)
          const b = JSON.stringify(newState)
    
          if (a === b) {
            callback && callback()
            return
          }
    
          this.state = newState
    
          const { persist } = this
          persist && persist._referencesState &&
            persist()
    
          await this.rerender()
    
          callback && callback()
    
        }
      }

      stores[key] = new Store()

      if (consumers.length >= 1) {
        for (let consumer of consumers) {

          const {
            mounted,
            staticSubscriptions,
            subscriptions,
          } = consumer

          if (!staticSubscriptions && subscriptions) {
            const { subscribe, rerender } = consumer
            subscribe()
            subscriptions !== consumer.subscriptions && mounted &&
              rerender()
          }

        }
      }
    }
  }
}