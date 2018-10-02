export const noop = () => {}

export const IN_NATIVE =
  navigator && navigator.product === 'ReactNative'


export const isClass = (InQuestion) =>
  !!InQuestion.constructor

export const isConfig = (inQuestion) => {
  if (typeof inQuestion !== 'object') {
    return false
  }
  for (let key in inQuestion) {
    if (inQuestion.hasOwnProperty(key)) {
      if (!isClass(inQuestion[key])) {
        return false
      }
    }
  }
  return true
}


export const isFunctionalComponent = (InQuestion) => {
  if (!InQuestion) return false
  const inQuestionAsString = String(InQuestion)
  return (
    typeof InQuestion === 'function' &&
    inQuestionAsString.includes('return') &&
    inQuestionAsString.includes('createElement')
  )
}

export const isStatefulComponent = (InQuestion) => (
  InQuestion
    ? (
        InQuestion.prototype &&
        InQuestion.prototype.isReactComponent
      )
    : false
)

export const isComponent = (InQuestion) => (
  isFunctionalComponent(InQuestion) ||
  isStatefulComponent(InQuestion)
)


export const getStoreSubgroup = (stores, keys) => (
  Object.assign({},
    ...keys.map((key) => ({
      [key]: stores[key],
    }))
  )
)


export const createUniqueId = () => (
  Math
    .floor((1 + Math.random()) * 0x1000000)
    .toString(16)
    .substring(1)
)