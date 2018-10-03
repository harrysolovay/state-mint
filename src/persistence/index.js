import error, {
  MISSING_PERSIST_STRATEGY,
  MISSING_TO_STORE,
  MISSING_FROM_STORE,
} from '~/errors'
import { IN_NATIVE } from '~/utilities'
import getPersistMethods from './methods'

export default (store, key) => {

  const { persistence } = store

  const noConfig = typeof persistence === 'boolean'

  error(noConfig && IN_NATIVE, MISSING_PERSIST_STRATEGY, key)

  const strategy = noConfig || !persistence.strategy
    ? window.localStorage
    : persistence.strategy

  const { fromStore, toStore, options } = persistence

  if ((fromStore || toStore) && !(fromStore && toStore)) {
    error(!!fromStore, MISSING_TO_STORE, key)
    error(!!toStore, MISSING_FROM_STORE, key)
  }

  const { get, set } = getPersistMethods(strategy, options, key)

  store.persist = Object.assign(() => {
    set( key,
      fromStore
        ? fromStore()
        : store.state,
    )
  }, {
    _referencesState: (
      !fromStore ||
      String(fromStore)
        .includes('state')
    ),
  })

  get(key, (data) => {
    if (data) {
      toStore
        ? toStore(data)
        : store.setState({ ...data })
    }
  })

}