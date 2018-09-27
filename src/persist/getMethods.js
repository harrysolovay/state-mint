import {
  storage,
  asyncStorage,
  secureStore,
  cookie,
} from './methods'

import error, {
  PERSIST_STRATEGY_INVALID,
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
        PERSIST_STRATEGY_INVALID,
        baseClassName,
      )
    }

    case 'String': {

      if (strategy === document.cookie) {
        return cookie(strategy, options)
      }

      return error(
        PERSIST_STRATEGY_INVALID,
        baseClassName,
      )
    }

    default: {

      return error(
        PERSIST_STRATEGY_INVALID,
        baseClassName,
      )
    }
  }
}