export { default as StoreSubgroup } from './StoreSubgroup'

export { default as PersistMethods } from './PersistMethods'

export const isFunction = (fn) => (
  fn && {}.toString.call(fn) === '[object Function]'
)

export const runningOnNative = (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)