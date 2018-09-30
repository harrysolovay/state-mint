import instantiate from './instantiate'
import { isConfig, isComponent } from '~/utilities'
import wrap from './wrap'

export default (config, ...args) => {

  const stores = {}
  
  config && instantiate(config, stores)

  const mint = (c, keys) => {

    if (isConfig(c)) {
      instantiate(c, stores)
      return mint
    }

    if (isComponent(c)) {
      return wrap(c, keys, stores)
    }

  }

  return mint

}