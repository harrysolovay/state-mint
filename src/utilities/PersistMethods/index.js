// flow type it!

import getStorageMethods from './getStorageMethods'
import getAsyncStorageMethods from './getAsyncStorageMethods'
import getSecureStoreMethods from './getSecureStoreMethods'
import getCookieMethods from './getCookieMethods'

import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

export default class PersistMethods {

  constructor (strategy, options) {

    const { constructor: { name: baseClassName } } = strategy

    switch(baseClassName) {

      // LocalStorage or SessionStorage
      case 'Storage': {
        const methods = getStorageMethods(strategy)
        Object.assign(this, methods)
        break
      }

      case 'Object': {

        if(
          // AsyncStorage
          strategy.setItem &&
          strategy.getItem &&
          strategy.removeItem
        ) {
          const methods = getAsyncStorageMethods(strategy)
          Object.assign(this, methods)
          break
        }

        // SecureStore
        if(
          strategy.setItemAsync &&
          strategy.getItemAsync &&
          strategy.deleteItemAsync
        ) {
          const methods = getSecureStoreMethods(strategy, options)
          Object.assign(this, methods)
          break
        }

        throw new StateMintError(
          PERSIST_STRATEGY_INVALID,
          baseClassName
        )
      }

      case 'String': {

        // document.cookie
        if(strategy === document.cookie) {
          const methods = getCookieMethods(strategy, options)
          Object.assign(this, methods)
          break
        }

        throw new StateMintError(
          PERSIST_STRATEGY_INVALID,
          baseClassName
        )
      }

      default: {

        throw new StateMintError(
          PERSIST_STRATEGY_INVALID,
          baseClassName
        )
      }
    }
  }
}