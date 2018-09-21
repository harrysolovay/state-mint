// @flow

import type { storageType } from '~/types'

export default (strategy: storageType) => ({

  set: (key: string, data: any, callback?: () => void): void => {
    const stringified = JSON.stringify(data)
    strategy.setItem(key, stringified)
    if (callback) callback()
  },

  get: (key: string, callback?: (any) => void): void => {
    const data: any = strategy.getItem(key)
    const parsed = JSON.parse(data)
    if (callback) callback(parsed)
  },

  remove: (key: string, callback?: () => void): void => {
    strategy.removeItem(key)
    if (callback) callback()
  },

})