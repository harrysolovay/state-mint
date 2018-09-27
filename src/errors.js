/* eslint max-len: 0 */

// import { IN_NATIVE } from '~/utilities'

export const MISSING_CONFIG ='MISSING_CONFIG'
export const INVALID_CONFIG ='INVALID_CONFIG'
export const TOO_MANY_ARGS ='TOO_MANY_ARGS'
export const MISSING_CONFIG_VALUES = 'MISSING_CONFIG_VALUES'
export const INVALID_CONFIG_VALUE ='INVALID_CONFIG_VALUE'

export const MISSING_WRAP_TARGET ='MISSING_WRAP_TARGET'
export const INVALID_WRAP_TARGET ='INVALID_WRAP_TARGET'
export const MISSING_KEYS ='MISSING_KEYS'
export const INVALID_KEYS ='INVALID_KEYS'
export const NONEXISTENT_KEY = 'NONEXISTENT_KEY'
export const OVERRIDING_STORES ='OVERRIDING_STORES'

export const MISSING_PERSIST_STRATEGY ='MISSING_PERSIST_STRATEGY'
export const INVALID_PERSIST_STRATEGY ='INVALID_PERSIST_STRATEGY'
export const MISSING_TO_STORE ='MISSING_TO_STORE'
export const MISSING_FROM_STORE ='MISSING_FROM_STORE'

const errors = {

  // initialize
  MISSING_CONFIG: () => `missing config`,
  INVALID_CONFIG: () => `invalid config`,
  TOO_MANY_ARGS: () => `too many args`,
  MISSING_CONFIG_VALUES: () => `missing config values`,
  INVALID_CONFIG_VALUE: () => `invalid config values`,

  // connect
  MISSING_WRAP_TARGET: () => `missing WrapTarget`,
  INVALID_WRAP_TARGET: () => `invalid WrapTarget`,
  MISSING_KEYS: () => `missing keys`,
  INVALID_KEYS: () => `invalid keys`,
  NONEXISTENT_KEY: () => `nonexistent key`,
  OVERRIDING_STORES: () => `overriding stores`,

  // persist
  MISSING_PERSIST_STRATEGY: () => `missing persist strategy`,
  INVALID_PERSIST_STRATEGY: () => `persist strategy`,
  MISSING_TO_STORE: () => `missing to store`,
  MISSING_FROM_STORE: () => `missing from store`,
  
}

export default (...args) => {
  console.log(args[0])
  throw new Error(
    errors[args[0]]
      ? errors[args[0]](...args)
      : args[0]
  )
}