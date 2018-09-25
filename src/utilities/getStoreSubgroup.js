import error, {
  INVALID_STORE_KEY,
} from '~/errors'

export default (stores, keys) => {
  return Object.assign({},
    ...Object
      .keys(stores)
      .map((key) => {

        keys.includes(key) &&
            error(INVALID_STORE_KEY, key)

        return { [key]: stores[key] }
      })
  )
}