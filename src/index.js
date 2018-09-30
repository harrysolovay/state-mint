import instantiate from './instantiate'
import { isConfig, isComponent } from '~/utilities'
import wrap from './wrap'

const mint = (config, ...args) => {

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

export default mint()
export { mint as init }