import { isRunningOnNative } from '~/utilities'

export const PERSIST_STRATEGY_MISSING = 'PERSIST_METHOD_INVALID'
export const PERSIST_STRATEGY_INVALID = 'PERSIST_STRATEGY_INVALID'
export const STORE_KEY_INVALID = 'STORE_KEY_INVALID'
export const MISSING_FROM_STORE = 'MISSING_FROM_STORE'
export const MISSING_TO_STORE = 'MISSING_TO_STORE'

const generateMessage = (errorNameOrMessage, key) => {
  switch(errorNameOrMessage) {

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

    default:
      return errorNameOrMessage
        ? errorNameOrMessage
        : null

  }
}

export default class StateMintError extends Error {
  constructor() {
    super(
      generateMessage(
        ...arguments
      )
    )
  }
}