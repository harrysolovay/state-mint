import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

// detect better!
const isAsync = (fn) => false

const withStandardSynchronicity = (strategy) => {

  // const { constructor: { name: baseClassName } }

  // switch(baseClassName) {
  //   case 'Storage': {
  //     // define methods
  //   }
  //   case 'Object': {
  //     if(
  //       !strategy.setItem ||
  //       !strategy.getItem ||
  //       !strategy.removeItem
  //     ) {
  //       throw new StateMintError(
  //         PERSIST_STRATEGY_INVALID,
  //         type
  //       )
  //     }
  //     // define methods
  //   }
  //   case 'String': {
  //     if(strategy === document.cookie) {
  //       // define methods
  //     }
  //   }
  // }

  const standardized = {}

  standardized.set = (key, data, callback) => {
    const stringified = JSON.stringify(data)
    if (isAsync(strategy.setItem)) {
      strategy.setItem(key, stringified, callback)
    } else {
      strategy.setItem(key, stringified)
      if (callback) callback()
    }
  }

  standardized.get = (key, callback) => {
    if(isAsync(strategy.getItem)) {
      strategy.getItem(key, (data) => {
        const parsed = JSON.parse(data)
        callback(parsed)
      })
    } else {
      const data = strategy.getItem(key)
      const parsed = JSON.parse(data)
      if (callback) callback(parsed)
    }
  }

  standardized.remove = strategy.removeItem

  return standardized
  
}

export default class Persister {

  constructor(strategy) {

    const { constructor: { name: type } } = strategy
    
    switch(type) {

      case 'Storage': {
        this.assign(
          withStandardSynchronicity(strategy)
        )
        break
      }

      case 'Object': {
        if(
          !strategy.setItem ||
          !strategy.getItem ||
          !strategy.removeItem
        ) {
          throw new StateMintError(
            PERSIST_STRATEGY_INVALID,
            type
          )
        }
        this.assign(
          withStandardSynchronicity(strategy)
        )
        break
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

  // not the cleanest, but we can't use Object.assign
  // (Object.assign creates error within constructor in React Native)
  assign = ({ set, get, remove }) => {
    this.set = set
    this.get = get
    this.remove = remove
  }

}