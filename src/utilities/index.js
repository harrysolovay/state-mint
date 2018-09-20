// @flow

export { default as StoreSubgroup } from './StoreSubgroup'

export { default as PersistMethods } from './PersistMethods'

export const isRunningOnNative = (): boolean => (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)

export const isReactComponent = (InQuestion: mixed): boolean => {
  const inQuestionAsString = String(InQuestion)
  return (
    typeof InQuestion === 'function' &&
    inQuestionAsString.includes('return') &&
    inQuestionAsString.includes('createElement')
  )
}