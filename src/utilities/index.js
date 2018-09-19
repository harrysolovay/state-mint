export { default as Persister } from './Persister'

export { default as StoreSubgroup } from './StoreSubgroup'

export const runningOnNative = (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)