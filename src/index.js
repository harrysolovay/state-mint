import error, {
  TOO_MANY_ARGS,
  INVALID_PROVIDE_ARGS,
  MISSING_MINT_ARGS,
  INVALID_MINT_ARGS,
} from '~/errors'
import instantiate from './instantiate'
import { isComponent, isConfig } from '~/utilities'
import wrap from './wrap'

const provide = (config, ...args) => {

  error(args.length >= 1, TOO_MANY_ARGS)

  const stores = {}
  let consumers = []
  
  if (config) {
    error(!isConfig(config), INVALID_PROVIDE_ARGS)
    instantiate(config, stores)
  }

  const mint = (c, keys, ...args) => {

    error(!!!c, MISSING_MINT_ARGS)
    error(args.length >= 1, TOO_MANY_ARGS)

    if (isComponent(c)) {
      return wrap(stores, consumers, c, keys)
    }

    if (isConfig(c)) {
      instantiate(stores, consumers, c)
      return mint
    }

    error(INVALID_MINT_ARGS)

  }

  return mint

}

export default provide()
export { provide }