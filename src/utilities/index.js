export { default as StoreSubgroup } from './StoreSubgroup'

export { default as PersistMethods } from './PersistMethods'

export const isRunningOnNative = () => (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)

export const isReactComponent = (InQuestion) => {
  const inQuestionAsString = String(InQuestion)
  return (
    typeof InQuestion === 'function' &&
    inQuestionAsString.includes('return') &&
    inQuestionAsString.includes('createElement')
  )
}