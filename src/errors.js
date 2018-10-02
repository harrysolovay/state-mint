/* eslint max-len: 0 */

import { IN_NATIVE } from '~/utilities'

// index
export const TOO_MANY_ARGS ='TOO_MANY_ARGS'
export const INVALID_PROVIDE_ARGS = 'INVALID_PROVIDE_ARGS'
export const MISSING_MINT_ARGS = 'MISSING_MINT_ARGS'
export const INVALID_MINT_ARGS = 'INVALID_MINT_ARGS'

// instanciate
export const STORE_KEY_ALREADY_EXISTS = 'STORE_KEY_ALREADY_EXISTS'

// wrap
export const LIFECYCLE_HOOKS_ON_STATEFUL = 'LIFECYCLE_HOOKS_ON_STATEFUL'
export const INVALID_STORE_KEYS = 'INVALID_STORE_KEYS'
export const NONEXISTENT_STORE_KEY = 'NONEXISTENT_STORE_KEY'
export const OVERRIDING_$_PROP = 'OVERRIDING_$_PROP'
export const INVALID_LIFECYCLE_HOOKS = 'INVALID_LIFECYCLE_HOOKS'

// persist
export const MISSING_PERSIST_STRATEGY = 'MISSING_PERSIST_STRATEGY'
export const INVALID_PERSIST_STRATEGY ='INVALID_PERSIST_STRATEGY'
export const MISSING_TO_STORE = 'MISSING_TO_STORE'
export const MISSING_FROM_STORE = 'MISSING_FROM_STORE'

const VALID_PERSIST_STRATEGIES = IN_NATIVE
  ? 'AsyncStorage or SecureStore'
  : 'window.localStorage, window.sessionStorage, or document.cookie'


const errors = {

  // index
  TOO_MANY_ARGS: () => `too many 'mint' args`,
  MISSING_MINT_ARGS: () => `missing 'mint' args`,
  INVALID_PROVIDE_ARGS: () => `invalid 'provide' args`,
  INVALID_MINT_ARGS: () => `invalid 'mint' args`,

  // instanciate
  STORE_KEY_ALREADY_EXISTS: () => `store key already exists`,

  // wrap
  LIFECYCLE_HOOKS_ON_STATEFUL: () => `cannot add lifecycle hooks to stateful component (do it inside the class definition)`,
  INVALID_LIFECYCLE_HOOKS: () => `invalid lifecycle hook configuration`,
  INVALID_STORE_KEYS: () => `invalid subscription (should be array of store keys)`,
  NONEXISTENT_STORE_KEY: (key) => `store key ${ key } does not exist`,
  OVERRIDING_$_PROP: () => `overriding stores props passed to target component`,

  // persist
  MISSING_PERSIST_STRATEGY: (key) => `'${ key }' store is missig a persist strategy`,
  INVALID_PERSIST_STRATEGY: (key) => `'${ key }' store has been assigned an invalid persist strategy (swap out with ${ VALID_PERSIST_STRATEGIES })`,
  MISSING_TO_STORE: (key) => `missing toStore in '${ key }'`,
  MISSING_FROM_STORE: (key) => `missing from fromStore in '${ key }'`,
  
}


class TraceableError extends Error {
  constructor(...args) {
    super(...args)
    const { captureStackTrace } = Error
    captureStackTrace &&
      captureStackTrace(this, TraceableError)
  }
}


export default (...args) => {

  let message
  let condition = true

  switch (args.length) {

    case 0: break

    case 1: {
      
      const e = args.shift()

      message = errors[e]
        ? errors[e]()
        : e

      break
    }

    default: {

      let e = args.shift()

      if (typeof e === 'boolean') {
        if (!e) condition = false
        e = args.shift()
      }
      message = errors[e]
        ? errors[e](...args)
        : e

      break
    }

  }

  if (condition) {
    process.env.NODE_ENV === 'development'
      ? (() => {
          const error = new TraceableError(message)
          error.name = '`state-mint` usage error'
          throw error
        })()
      : console.error(message)
  }

}