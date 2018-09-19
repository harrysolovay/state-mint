// flow type it!

import SyncStoragePersister from './SyncStoragePersister'
import AsyncStoragePersister from './AsyncStoragePersister'
import CookiePersister from './CookiePersister'

import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

export default class Persister {

  // we can't use Object.assign
  // (would create an error in React Native)

  assign = (persister) => {
    Object
      .keys(persister)
      .forEach((key) => {
        this[key] = persister[key]
      })
  }

  constructor(strategy, options) {

    const { constructor: { name: baseClassName } } = strategy

    switch(baseClassName) {

      case 'Storage': {
        
        const persister = new SyncStoragePersister(strategy)
        this.assign(persister)

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
            baseClassName
          )
        }

        const persister = new AsyncStoragePersister(strategy)
        this.assign(persister)

        break
      }

      case 'String': {

        if(strategy === document.cookie) {
          const persister = new CookiePersister(strategy)
          this.assign(persister)
        }

        break
      }
  
      default: {

        throw new StateMintError(
          PERSIST_STRATEGY_INVALID,
          baseClassName
        )

        break
      }

    }
  }

}