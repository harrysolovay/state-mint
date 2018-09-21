// flow type it!

import type {
  persistStrategyType,
  persistMethodsType,
} from '~/types'

import getStorageMethods from './getStorageMethods'
import getAsyncStorageMethods from './getAsyncStorageMethods'
import getSecureStoreMethods from './getSecureStoreMethods'
import getCookieMethods from './getCookieMethods'

import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

export default class PersistMethods {

  constructor(strategy: persistStrategyType, options?: {}) {

    const { constructor: { name: baseClassName } } = strategy

    switch (baseClassName) {

      // LocalStorage or SessionStorage
      case 'Storage': {
        const methods: persistMethodsType = getStorageMethods(strategy)
        Object.assign(this, methods)
        break
      }

      case 'Object': {

        // AsyncStorage
        if (
          strategy.setItem &&
          strategy.getItem &&
          strategy.removeItem
        ) {
          const methods: persistMethodsType = getAsyncStorageMethods(strategy)
          Object.assign(this, methods)
          break
        }

        // SecureStore
        if (
          strategy.setItemAsync &&
          strategy.getItemAsync &&
          strategy.deleteItemAsync
        ) {
          const methods: persistMethodsType = getSecureStoreMethods(strategy, options)
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
        if (strategy === document.cookie) {
          const methods: persistMethodsType = getCookieMethods(strategy, options)
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