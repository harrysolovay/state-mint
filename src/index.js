import instantiate from './instantiate'
import { isComponent, isConfig } from '~/utilities'
import wrap from './wrap'

const init = (config, ...args) => {

  const stores = {}
  
  config && instantiate(config, stores)

  const mint = (c, keys) => {

    if (isComponent(c)) {
      return wrap(c, stores, keys)
    }

    if (isConfig(c)) {
      instantiate(c, stores)
      return mint
    }

  }

  return mint
  
}

export default init()
export { init }