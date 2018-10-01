import storage from './storage'
import asyncStorage from './asyncStorage'
import secureStore from './secureStore'
import error, { INVALID_PERSIST_STRATEGY } from '~/errors'
import cookie from './cookie'


const isAsyncStorage = ({ setItem, getItem, removeItem }) =>
  setItem && getItem && removeItem

const isSecureStore = ({ setItemAsync, getItemAsync, deleteItemAsync }) =>
  setItemAsync && getItemAsync && deleteItemAsync

const isCookie = (inQuestion) =>
  inQuestion === document.cookie


export default (strategy, options, key) => {

  const { constructor: { name } } = strategy

  switch (name) {

    case 'Storage': {
      return storage(strategy)
    }

    case 'Object': {
      return isAsyncStorage(strategy)
        ? asyncStorage(strategy)
        : isSecureStore(strategy)
          ? secureStore( strategy, options)
          : error(INVALID_PERSIST_STRATEGY, key)
    }

    case 'String': {
      return isCookie(strategy)
        ? cookie(strategy, options)
        : error(INVALID_PERSIST_STRATEGY, key)
    }

    default: {
      return error(INVALID_PERSIST_STRATEGY, key)
    }
  }
}