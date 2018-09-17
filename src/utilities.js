import StateMintError, {
  STORE_REFERENCE_ERROR,
} from './errors'

export const rescope = (allStores, limitTo) => (
  Object.assign({},
    ...limitTo
      .filter((key) => {
        const exists = Object
          .keys(allStores)
          .includes(key)
        if(!exists) {
          throw new StateMintError(STORE_REFERENCE_ERROR, key)
        }
        return exists
      })
      .map((key) => ({
        [key]: allStores[key]
      }))
  )
)