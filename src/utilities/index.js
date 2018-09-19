export { default as StoreSubgroup } from './StoreSubgroup'

export { default as getPersister } from './Persister'

export const isFunction = (fn) => (
  fn && {}.toString.call(fn) === '[object Function]'
)

export const runningOnNative = (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)