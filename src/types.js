// @flow

export type storesType = {|
  [string]: {
    setState: (
      updater: {} | ((prevState: {}) => {}),
      callback?: () => void,
    ) => void,
  },
|}

export type AsyncStorage = {|

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

|}