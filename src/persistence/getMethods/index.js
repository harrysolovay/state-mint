import storage from './storage'
import asyncStorage from './asyncStorage'
import secureStore from './secureStore'
import cookie from './cookie'

import error, {
  INVALID_PERSIST_STRATEGY,
} from '~/errors'

export default (strategy, options) => {

  const { constructor: { name: baseClassName } } = strategy

  switch (baseClassName) {

    case 'Storage': {
      return storage(strategy)
    }

    case 'Object': {

      if (
        strategy.setItem &&
        strategy.getItem &&
        strategy.removeItem
      ) {
        return asyncStorage(strategy)
      }

      if (
        strategy.setItemAsync &&
        strategy.getItemAsync &&
        strategy.deleteItemAsync
      ) {
        return secureStore(
          strategy,
          options,
        )
      }

      return error(
        INVALID_PERSIST_STRATEGY,
        baseClassName,
      )
    }

    case 'String': {

      if (strategy === document.cookie) {
        return cookie(strategy, options)
      }

      return error(
        INVALID_PERSIST_STRATEGY,
        baseClassName,
      )
    }

    default: {

      return error(
        INVALID_PERSIST_STRATEGY,
        baseClassName,
      )
    }
  }
}