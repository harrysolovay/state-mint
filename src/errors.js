/* eslint max-len: 0 */

import { IN_NATIVE } from '~/utilities'

// initialize
export const MISSING_CONFIG ='MISSING_CONFIG'
export const INVALID_CONFIG ='INVALID_CONFIG'
export const TOO_MANY_ARGS ='TOO_MANY_ARGS'
export const MISSING_CONFIG_VALUES = 'MISSING_CONFIG_VALUES'
export const INVALID_CONFIG_VALUE ='INVALID_CONFIG_VALUE'
export const STORE_KEY_ALREADY_EXISTS = 'STORE_KEY_ALREADY_EXISTS'

// connect
export const MISSING_WRAP_TARGET ='MISSING_WRAP_TARGET'
export const INVALID_WRAP_TARGET ='INVALID_WRAP_TARGET'
export const MISSING_KEYS ='MISSING_KEYS'
export const INVALID_KEYS ='INVALID_KEYS'
export const NONEXISTENT_KEY = 'NONEXISTENT_KEY'
export const OVERRIDING_STORES ='OVERRIDING_STORES'

// persist
export const MISSING_PERSIST_STRATEGY ='MISSING_PERSIST_STRATEGY'
export const INVALID_PERSIST_STRATEGY ='INVALID_PERSIST_STRATEGY'
export const MISSING_TO_STORE ='MISSING_TO_STORE'
export const MISSING_FROM_STORE ='MISSING_FROM_STORE'


const VALID_PERSIST_STRATEGIES = IN_NATIVE
  ? 'AsyncStorage or SecureStore'
  : 'window.localStorage, window.sessionStorage, or document.cookie'


const errors = {

  // initialize
  MISSING_CONFIG: () => `missing config`,
  INVALID_CONFIG: () => `invalid config`,
  TOO_MANY_ARGS: () => `too many args`,
  MISSING_CONFIG_VALUES: () => `missing config values`,
  INVALID_CONFIG_VALUE: (key) => `invalid config value for '${ key }'`,
  STORE_KEY_ALREADY_EXISTS: (key) => `store named ${ key } already initialized`,

  // connect
  MISSING_WRAP_TARGET: () => `missing WrapTarget`,
  INVALID_WRAP_TARGET: () => `invalid WrapTarget`,
  MISSING_KEYS: () => `missing keys`,
  INVALID_KEYS: () => `invalid keys`,
  NONEXISTENT_KEY: (key) => `nonexistent key '${ key }'`,
  OVERRIDING_STORES: () => `overriding stores`,

  // persist
  MISSING_PERSIST_STRATEGY: (key) => `'${ key }' store is missig a persist strategy (TODO: suggestion)`,
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

  console.log(...args)

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