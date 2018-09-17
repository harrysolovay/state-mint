export const PERSIST_METHOD_REFERENCE_ERROR = 'PERSIST_METHOD_REFERENCE_ERROR'
export const STORE_REFERENCE_ERROR = 'STORE_REFERENCE_ERROR'

export default class StateMintError extends ReferenceError {
  constructor(errorName, key) {
    super((() => {
      switch(errorName) {
        case PERSIST_METHOD_REFERENCE_ERROR: {
          return `Must pass method (such as window.localStorage) in '${ key }' store as the first element of the 'persist: []' instance variable.`
        }
        case STORE_REFERENCE_ERROR: {
          return `Cannot find store with key of '${ key }'; you're currently trying to access a store which hasn't been initialized`
        }
        default: {
          return null
        }
      }
    })())
  }
}