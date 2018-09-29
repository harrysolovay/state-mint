import {
  isConfig,
  isComponent,
} from '~/utilities'

import instanciate from './instanciate'
import consumer from './consumer'

export default (config, ...args) => {

  const stores = {}
  
  instanciate(config, stores)

  return (c, keys) => {

    isConfig(c) &&
      instanciate(c, stores)

    if (isComponent(c)) {
      return consumer(stores)(c, keys)
    }

  }
  
}