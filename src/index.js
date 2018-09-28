import React, {
  Component,
} from 'react'

import error, {
  MISSING_CONFIG,
  INVALID_CONFIG,
  TOO_MANY_ARGS,
  MISSING_CONFIG_VALUES,
  INVALID_CONFIG_VALUE,
  STORE_KEY_ALREADY_EXISTS,
  MISSING_WRAP_TARGET,
  INVALID_WRAP_TARGET,
  MISSING_KEYS,
  INVALID_KEYS,
  NONEXISTENT_KEY,
  OVERRIDING_STORES,
} from '~/errors'

import {
  forOf,
  forEach,
  isComponent,
  StoreSubgroup,
} from '~/utilities'

import setPersistence from '~/persist'

export default (config, ...args) => {

  !config &&
    error(MISSING_CONFIG)

  typeof config !== 'object' &&
    error(INVALID_CONFIG)

  args.length > 0 &&
    error(TOO_MANY_ARGS)

  Object.keys(config).length < 1 &&
    error(MISSING_CONFIG_VALUES)

  const stores = {}

  const createStoreConstructor = (key, Store) => {

    typeof Store !== 'function' &&
      error(INVALID_CONFIG_VALUE, key)

    return class extends Store {

      _subscribers = {}

      $ = stores

      constructor() {
        super()
        this.persist &&
          setPersistence(this, key)
      }

      async setState(updater, callback) {

        const { state: lastState } = this

        const newState = typeof updater === 'function'
          ? updater(lastState)
          : updater

        const a = JSON.stringify(lastState)
        const b = JSON.stringify(newState)

        if (a === b) {
          callback && callback()
          return
        }

        this.state = Object.assign({},
          lastState,
          newState,
        )

        const { persist } = this
        const { _referencesState } = persist
        persist && _referencesState && persist()

        const { _subscribers } = this
        const pending = Object
          .values(_subscribers)
          .map(({ rerender }) => rerender())
        await Promise.all(pending)

        callback && callback()

      }
    }
  }

  const init = (config) => {
    forOf(config, (key) => {

      stores[key] &&
        error(
          STORE_KEY_ALREADY_EXISTS,
          key,
        )

      const Store = createStoreConstructor(
        key,
        config[key],
      )

      stores[key] = new Store()

    })
  }

  init(config)
  
  return (WrapTarget, keys, ...args) => {

    !WrapTarget &&
      error(MISSING_WRAP_TARGET)

    !isComponent(WrapTarget) &&
      error(INVALID_WRAP_TARGET)

    !keys &&
      error(MISSING_KEYS)

    !Array.isArray(keys) &&
      error(INVALID_KEYS)

    for (let key of keys) {
      !Object
        .keys(stores)
        .includes(key) &&
          error(NONEXISTENT_KEY, key)
    }

    args.length > 0 &&
      error(TOO_MANY_ARGS)

    const $ = new StoreSubgroup(
      stores,
      keys,
    )

    return class extends Component {

      static displayName =
        `connect(${
          WrapTarget.displayName ||
          WrapTarget.name ||
          'WrapTarget'
        })`

      _componentId = Math
        .floor((1 + Math.random()) * 0x1000000)
        .toString(16)
        .substring(1)

      rerender = () => (
        this.mounted
          ? new Promise((resolve) => (
              this.setState({}, resolve)
            ))
          : resolve()
      )

      subscribe = (to = keys) => {
        forEach(to, (key) => {
          stores[key]._subscribers[this._componentId] = this
        })
      }

      unsubscribe = (from = keys) => {
        forEach(from, (key) => {
          delete stores[key]._subscribers[this._componentId]
        })
      }

      constructor(props) {
        super()
        const { $ } = props
        $ &&
          error(OVERRIDING_STORES)
      }

      render() {

        const {
          props,
          subscribe,
          unsubscribe,
        } = this

        return (
          <WrapTarget
            { ...props }
            $={{
              ...$,
              subscribe,
              unsubscribe,
            }}
          />
        )
      }

      componentDidMount() {
        this.mounted = true
        this.subscribe()
      }

      componentWillUnmount() {
        this.mounted = false
        this.unsubscribe()
      }
    }
  }
}