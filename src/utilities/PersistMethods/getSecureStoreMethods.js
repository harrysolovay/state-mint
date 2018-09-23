// @flow

import type {
  SecureStoreType,
  optionsType,
} from '~/types'

export default (strategy: SecureStoreType, options?: optionsType) => ({

  set: (key: string, data: any, callback?: () => void): void => {
    (async () => {
      if (data) {
        const stringified = JSON.stringify(data)
        await strategy.setItemAsync(key, stringified, options)
        callback && callback()
      }
    })()
  },

  get: (key: string, callback?: (any) => void): void => {
    (async () => {
      const data = await strategy.getItemAsync(key, options)
      if (data) {
        const parsed = JSON.parse(data)
        callback && callback(parsed)
      }
    })()
  },

  remove: (key: string, callback?: () => void): void => {
    (async () => {
      await strategy.deleteItemAsync(key, options)
      callback && callback()
    })()
  },

})