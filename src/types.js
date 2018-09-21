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

export type AsyncStorageType = {

  setItem(
    key: string,
    value: string,
    callback?: ?(error: ?Error) => void
  ): Promise<any>,

  getItem(
    key: string,
    callback?: ?(error: ?Error, result: ?string) => void
  ): Promise<any>,

  removeItem(
    key: string,
    callback?: ?(error: ?Error) => void
  ): Promise<any>,

}

export type persistStrategyType =
  | AsyncStorageType
  | any // add other types