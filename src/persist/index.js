import {
  IN_NATIVE,
} from '~/utilities'

import error, {
  MISSING_PERSIST_STRATEGY,
  MISSING_TO_STORE,
  MISSING_FROM_STORE,
} from '~/errors'

import getMethods from './getMethods'

export default (store, key) => {

  const { persist } = store

  let strategy = typeof persist === 'boolean'
    ? IN_NATIVE
      ? error(MISSING_PERSIST_STRATEGY, key)
      : window.localStorage
    : persist.strategy

  const { fromStore, toStore, options } = persist

  if ((fromStore || toStore) && !(fromStore && toStore)) {
    error(
      fromStore
        ? MISSING_TO_STORE
        : MISSING_FROM_STORE,
      key,
    )
  }

  const persistMethods = getMethods(
    strategy,
    options,
  )

  store.persist = Object.assign(
    () => {
      persistMethods.set(
        key,
        fromStore
          ? fromStore()
          : store.state
      )
    }, {
      _referencesState: (
        !fromStore ||
          String(fromStore)
            .includes('state')
      ),
    }
  )

  persistMethods.get(key, (data) => {
    if (data) {
      toStore
        ? toStore(data)
        : store.setState(data)
    }
  })

}