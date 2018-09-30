import {
  IN_NATIVE,
} from '~/utilities'

import error, {
  MISSING_PERSIST_STRATEGY,
  MISSING_TO_STORE,
  MISSING_FROM_STORE,
} from '~/errors'

import getMethods from './getMethods'

export default (store, key, config) => {

  const strategy = typeof config === 'boolean'
    ? IN_NATIVE
      ? error(
          MISSING_PERSIST_STRATEGY,
          key,
        )
      : window.localStorage
    : config.strategy

  const { fromStore, toStore, options } = config

  if (
    (fromStore || toStore) &&
    !(fromStore && toStore)
  ) {
    fromStore &&
      error(MISSING_TO_STORE, key)
    toStore &&
      error(MISSING_FROM_STORE, key)
  }

  const persistMethods = getMethods(
    strategy,
    options,
  )

  Object.assign(
    store._persistence, {

      trigger: () => {
        persistMethods.set(
          key,
          fromStore
            ? fromStore()
            : store.state
        )
      },
      
      referencesState: (
        !fromStore ||
          String(fromStore)
            .includes('state')
      ),

    }
  )

  // persistMethods.remove(key)

  persistMethods.get(key, (data) => {
    if (data) {
      toStore
        ? toStore(data)
        : store.setState({ ...data })
    }
  })

}