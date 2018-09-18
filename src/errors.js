export const PERSIST_STRATEGY_MISSING = 'PERSIST_METHOD_INVALID'
export const PERSIST_STRATEGY_INVALID = 'PERSIST_STRATEGY_INVALID'
export const STORE_KEY_INVALID = 'STORE_KEY_INVALID'

const generateMessage = (errorNameOrMessage, key) => {
  switch(errorNameOrMessage) {

    case PERSIST_STRATEGY_MISSING:
      return `Must pass data-persisting strategy (such as window.localStorage) in '${ key }' store as the first element of the 'persist: []' instance variable.`

    case PERSIST_STRATEGY_INVALID:
      return `Strategy ${ key } is invalid. See documentation for a list of valid strategies: [url].`

    case STORE_KEY_INVALID:
      return `Cannot find store with key of '${ key }'; double check that you've initialized all stores whose keys are referenced from your connect() calls.`

    default:
      return errorNameOrMessage
        ? errorNameOrMessage
        : null

  }
}

export default class StateMintError extends ReferenceError {
  constructor() {
    super(
      generateMessage(
        ...arguments
      )
    )
  }
}