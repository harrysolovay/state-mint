// flow

export const forOf = (o: {}, fn: (...args: Array<any>) => any) => {
  for (let key in o) {
    if (o.hasOwnProperty(key)) {
      fn(key)
    }
  }
}

export const forEach = (a: Array, fn: (...args: Array<any>) => any) => {
  for (let e of a) {
    fn(e)
  }
}

export const isFunctionalComponent = (InQuestion: mixed): boolean => {
  if (!InQuestion) return false
  const inQuestionAsString = String(InQuestion)
  return (
    typeof InQuestion === 'function' &&
    inQuestionAsString.includes('return') &&
    inQuestionAsString.includes('createElement')
  )
}

export const isStatefulComponent = (InQuestion: mixed): boolean => {
  if (!InQuestion) return false
  return (
    InQuestion.prototype &&
    InQuestion.prototype.isReactComponent
  )
}

export const isComponent = (InQuestion: mixed): boolean => {
  return (
    isFunctionalComponent(InQuestion) ||
    isStatefulComponent(InQuestion)
  )
}

// TODO: complete w algorithm
export const getDependencies = (Component) => {

  if (isFunctionalComponent(Component)) {
    console.log(String(Component))
  }

  if (isStatefulComponent(Component)) {
    console.log(Component)
  }

}

export const IN_NATIVE: boolean = (
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