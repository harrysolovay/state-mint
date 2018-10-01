import instantiate from './instantiate'
import { isComponent, isConfig } from '~/utilities'
import wrap from './wrap'
import error from '~/errors'

const init = (config) => {

  const stores = {}
  
  config && instantiate(config, stores)

  const mint = (c, keys, ...args) => {

    error(!!!c, 'MISSING_MINT_CONFIG_OR_TARGET')

    if (isComponent(c)) {
      return wrap(c, stores, keys)
    }

    if (isConfig(c)) {
      instantiate(c, stores)
      return mint
    }

    error('INVALID_MINT_CONFIG')

  }

  return mint

}

export default init()
export { init }