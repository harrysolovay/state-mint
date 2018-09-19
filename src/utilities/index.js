export { default as StoreSubgroup } from './StoreSubgroup'
export { default as Persister } from './Persister'
export const runningOnNative = (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)