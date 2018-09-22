// @flow

export type storesType = {|
  [string]: {
    setState: (
      updater: {} | ((prevState: {}) => {}),
      callback?: () => void,
    ) => void,
  },
|}

export type persistMethodsType = {
  set: (key: string, data: any, callback?: () => void) => void,
  get: (key: string, callback?: (any) => void) => void,
  remove: (key: string, callback?: () => void) => void,
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
  setItem: (key: string, value: string, callback?: ?(error: ?Error) => void) => Promise<string>,
  getItem: (key: string, callback?: ?(error: ?Error, result: ?string) => void) => Promise<string>,
  removeItem: (key: string, callback?: ?(error: ?Error) => void) => Promise<string>,
}

export type SecureStore = {
  setItemAsync: (key: string, value: string, options: {}) => Promise<string>,
  getItemAsync: (key: string, options: {}) => Promise<string>,
  deleteItemAsync: (key: string, options: {}) => Promise<string>,
}

export type persistStrategyType =
  | storageType
  | cookieType
  | AsyncStorageType
  | SecureStore