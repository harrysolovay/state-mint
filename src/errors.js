// @flow

import { isRunningOnNative } from '~/utilities'

export const PERSIST_STRATEGY_MISSING = 'PERSIST_METHOD_INVALID'
export const PERSIST_STRATEGY_INVALID = 'PERSIST_STRATEGY_INVALID'
export const STORE_KEY_INVALID = 'STORE_KEY_INVALID'
export const MISSING_FROM_STORE = 'MISSING_FROM_STORE'
export const MISSING_TO_STORE = 'MISSING_TO_STORE'
export const INVALID_MINT_CONFIG = 'INVALID_MINT_CONFIG'
export const INVALID_WRAP_TARGET = 'INVALID_WRAP_TARGET'

const errors = {
  PERSIST_STRATEGY_MISSING,
  PERSIST_STRATEGY_INVALID,
  STORE_KEY_INVALID,
  MISSING_FROM_STORE,
  MISSING_TO_STORE,
  INVALID_MINT_CONFIG,
  INVALID_WRAP_TARGET,
}

type errorType = $Values<typeof errors>

const generateMessage = (errorNameOrMessage, key) => {
  switch (errorNameOrMessage) {

    case PERSIST_STRATEGY_MISSING: {
      const potentialStrategies = isRunningOnNative()
        ? 'AsyncStorage or SecureStore'
        : `'cookie' or window.localStorage`
      return `Must assign a valid persistence strategy (such as '${ potentialStrategies }), in '${ key }' store.`
    }

    case PERSIST_STRATEGY_INVALID:
      return `Strategy '${ key }' is invalid. See documentation for a list of valid strategies: [url].`

    case STORE_KEY_INVALID:
      return `Cannot find store with key of '${ key }'; double check that you've initialized all stores whose keys are referenced from your connect() calls.`

    case MISSING_FROM_STORE:
      return `Persisted data is mapped to '${ key }' store (with 'persist.toStore'), but the reverse mapping ('persist.fromStore') is undefined.`

    case MISSING_TO_STORE:
      return `Persisted data is mapped from '${ key }' store (with 'persist.fromStore'), but the reverse mapping ('persist.toStore') is undefined.`

    case INVALID_MINT_CONFIG:
      return `Cannot call 'mint' with supplied arguments; refer to documentation for correct usage.`

    case INVALID_WRAP_TARGET: {
      switch (key) {
        case 'storesConfig':
          return `The function returned from calling 'mint({ ...storesConfig })' can only be called with a valid React Component (which will then provide your stores to minted children).`
        case 'storeKeys':
          return `The function returned from calling 'mint([ ...storeKeys ])' can only be called with a valid React Component (to which your stores will be connected).`
        default: // just incase
          return `The function returned from calling 'mint(arg)' can only be called with a valid React Component.`
      }
    }

    default:
      return errorNameOrMessage
        ? errorNameOrMessage
        : null

  }
}

export default class StateMintError extends Error {
  constructor(error: errorType, key?: string) {
    super(
      generateMessage(
        ...arguments
      )
    )
  }
}