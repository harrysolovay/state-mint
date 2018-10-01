export const isFunctionalComponent = (InQuestion) => {
  if (!InQuestion) return false
  const inQuestionAsString = String(InQuestion)
  return (
    typeof InQuestion === 'function' &&
    inQuestionAsString.includes('return') &&
    inQuestionAsString.includes('createElement')
  )
}

export const isStatefulComponent = (InQuestion) => {
  if (!InQuestion) return false
  return (
    InQuestion.prototype &&
    InQuestion.prototype.isReactComponent
  )
}

export const isComponent = (InQuestion) => {
  return (
    isFunctionalComponent(InQuestion) ||
    isStatefulComponent(InQuestion)
  )
}

export const noop = () => {}

export const IN_NATIVE = (
  typeof navigator !== 'undefined' &&
  navigator.product === 'ReactNative'
)

export class StoreSubgroup {
  constructor(stores, keys) {
    Object.assign(this,
      ...keys.map((key) => ({
        [key]: stores[key],
      }))
    )
  }
}

export const isClass = (InQuestion) => (
  InQuestion.prototype
    ? (
        InQuestion.prototype.constructor &&
        InQuestion.prototype.constructor.toString &&
        InQuestion.prototype.constructor
          .toString()
          .substring(0, 5) === 'class'
      )
    : (
        InQuestion.constructor &&
        InQuestion.constructor
          .toString()
          .substring(0, 5) === 'class'
      )
)

export const isConfig = (inQuestion) => {
  for (let key in inQuestion) {
    if (
      inQuestion.hasOwnProperty(key) &&
      typeof key !== 'string' &&
      !isClass(inQuestion(key))
    ) {
      return false
    }
  }
  return typeof inQuestion === 'object'
}

export const createUniqueId = () => (
  Math
    .floor((1 + Math.random()) * 0x1000000)
    .toString(16)
    .substring(1)
)