// @flow

export type storesType = {|
  [string]: {
    setState: (
      updater: {} | ((prevState: {}) => {}),
      callback?: () => void,
    ) => void,
  },
|}

export type setPersistedData = (key: string, data: any, callback?: () => void) => void
export type getPersistedData = (key: string, callback?: (any) => void) => void
export type removePersistedData = (key: string, callback?: () => void) => void

export type PersistMethodsType = {
  set: setPersistedData,
  get: getPersistedData,
  remove: removePersistedData,
}

export type storageType = {
  setItem: (key: string, value: string) => void,
  getItem: (key: string) => string | null,
  removeItem: (key: string) => void,
}

export type cookieType = typeof document.cookie
export type optionsType = {|
  days?: number,
|}

export type AsyncStorageType = {
  setItem: (key: string, value: string, callback?: ?(error: ?Error) => void) => void,
  getItem: (key: string, callback?: ?(error: ?Error, result: ?string) => void) => void,
  removeItem: (key: string, callback?: ?(error: ?Error) => void) => void,
}

export type SecureStoreType = {
  setItemAsync: (key: string, value: string, options?: {}) => void,
  getItemAsync: (key: string, options?: {}) => void,
  deleteItemAsync: (key: string, options?: {}) => void,
}

export type persistStrategyType =
  | storageType
  | cookieType
  | AsyncStorageType
  | SecureStoreType