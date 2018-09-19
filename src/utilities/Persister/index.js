// flow type it!

import StorageMethods from './SyncStorageMethods'
import AsyncStorageMethods from './AsyncStorageMethods'
import SecureStoreMethods from './SecureStoreMethods'
import CookieMethods from './CookieMethods'

import StateMintError, {
  PERSIST_STRATEGY_INVALID,
} from '~/errors'

export default (strategy, options) => {

  const { constructor: { name: baseClassName } } = strategy

  switch(baseClassName) {

    case 'Storage': {

      return new StorageMethods(strategy)

      break
    }

    case 'Object': {

      if(
        strategy.setItem &&
        strategy.getItem &&
        strategy.removeItem
      ) {
        return new AsyncStorageMethods(strategy)
      }

      if(
        strategy.setItemAsync &&
        strategy.getItemAsync &&
        strategy.deleteItemAsync
      ) {
        return new SecureStoreMethods(strategy)
      }

      throw new StateMintError(
        PERSIST_STRATEGY_INVALID,
        baseClassName
      )
    }

    case 'String': {

      if(strategy === document.cookie) {
        return new CookieMethods(strategy)
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