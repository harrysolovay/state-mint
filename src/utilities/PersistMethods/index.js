// @flow

import type {
  setPersistedData,
  getPersistedData,
  removePersistedData,
  persistStrategyType,
  optionsType,
  PersistMethodsType,
} from '~/types'

import getStorageMethods from './getStorageMethods'
import getAsyncStorageMethods from './getAsyncStorageMethods'
import getSecureStoreMethods from './getSecureStoreMethods'
import getCookieMethods from './getCookieMethods'

import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

export default class PersistMethods {

  set: setPersistedData
  get: getPersistedData
  remove: removePersistedData

  constructor(strategy: mixed, options?: optionsType) {

    const { constructor: { name: baseClassName } } = strategy

    switch (baseClassName) {

      // LocalStorage or SessionStorage
      case 'Storage': {
        const methods: PersistMethodsType = getStorageMethods(strategy)
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
          const methods: PersistMethodsType = getAsyncStorageMethods(strategy)
          Object.assign(this, methods)
          break
        }

        // SecureStore
        if (
          strategy.setItemAsync &&
          strategy.getItemAsync &&
          strategy.deleteItemAsync
        ) {
          const methods: PersistMethodsType = getSecureStoreMethods(strategy, options)
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
          const methods: PersistMethodsType = getCookieMethods(strategy, options)
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