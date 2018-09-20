// @flow

import type {
  StoresType
} from '~/types'

import StateMintError, {
  STORE_KEY_INVALID,
} from '~/errors'

export default class StoreSubgroup {

  stores = {}

  constructor(stores: StoresType, limitTo: Array<string>) {
    limitTo
      .filter((key) => {
        const exists = Object
          .keys(stores)
          .includes(key)
        if(!exists) {
          throw new StateMintError(
            STORE_KEY_INVALID,
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