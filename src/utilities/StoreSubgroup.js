// @flow

import type {
  storesType,
} from '~/types'

import StateMintError, {
  INVALID_STORE_KEY,
} from '~/errors'

export default class StoreSubgroup {

  stores = {}

  constructor(stores: storesType, limitTo: Array<string>) {
    limitTo
      .filter((key) => {
        const exists = Object
          .keys(stores)
          .includes(key)
        if (!exists) {
          throw new StateMintError(
            INVALID_STORE_KEY,
            key
          )
        }
        return exists
      })
      .forEach((key) => {
        this.stores[key] = stores[key]
      })
      
  }
}