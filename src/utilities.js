import StateMintError, {
  STORE_KEY_INVALID,
  PERSIST_STRATEGY_INVALID,
} from './errors'

export const rescope = (allStores, limitTo) => (
  Object.assign({},
    ...limitTo
      .filter((key) => {
        const exists = Object
          .keys(allStores)
          .includes(key)
        if(!exists) {
          throw new StateMintError(
            STORE_KEY_INVALID,
            key
          )
        }
        return exists
      })
      .map((key) => ({
        [key]: allStores[key]
      }))
  )
)

export class PersistenceMethods {
  constructor(strategy) {
    
    switch(strategy.constructor.name) {

      case 'Storage': {

        this.set = (key, data, callback) => {
          console.log('set', key, data, callback)
          strategy.setItem(key, JSON.stringify(data))
          if(callback) callback()
        }

        this.get = (key, callback) => {
          console.log('get', key, callback)
          const data = JSON.parse(
            strategy.getItem(key)
          )
          if(callback) callback(data)
        }

        this.remove = (key, callback) => {
          strategy.removeItem(key)
          if(callback) callback()
        }
        
        break
      }
  
      case 'Async': {
        throw new StateMintError('async not ready yet')
      }
  
      case 'String': {
        throw new StateMintError('cookies not ready yet')
      }
  
      default: {
        throw new StateMintError(
          PERSIST_STRATEGY_INVALID,
          type
        )
      }

    }
  }
}