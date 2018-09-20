export type storesType = {|
  [string]: {
    setState: (
      updater: {} | ((prevState: {}) => {}),
      callback?: () => void
    ) => void
  },
|}