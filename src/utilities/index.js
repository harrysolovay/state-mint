export { default as StoreSubgroup } from './StoreSubgroup'

export { default as PersistMethods } from './PersistMethods'

export const isRunningOnNative = () =>
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'