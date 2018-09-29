import React, {
  Component,
} from 'react'

import {
  isConfig,
  isComponent,
  isAsync,
} from '~/utilities'

import instanciate from './instanciate'

import consumer from './consumer'

export default (config, ...args) => {
  const stores = instanciate(config)
  return consumer(stores)
}