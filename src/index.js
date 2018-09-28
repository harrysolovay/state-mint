import React, {
  Component,
} from 'react'

import error, {
  MISSING_CONFIG,
  INVALID_CONFIG,
  TOO_MANY_ARGS,
  MISSING_CONFIG_VALUES,
  INVALID_CONFIG_VALUE,
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

import persist from '~/persist'

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

  forOf(config, (key) => {

    typeof config[key] !== 'function' &&
      error(INVALID_CONFIG_VALUE, key)

    class Store extends config[key] {

      $ = stores
      _subscribers = []

      constructor() {
        super()
        this.persist &&
          persist(this, key)
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
        const pending = _subscribers.map(({ rerender }) => rerender())
        await Promise.all(pending)

        callback && callback()

      }
    }

    stores[key] = new Store()
  
  })

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
          error(NONEXISTENT_KEY, e)
    }

    args.length > 0 &&
      error(TOO_MANY_ARGS)

    return class extends Component {

      static displayName =
        `connect(${
          WrapTarget.displayName ||
          WrapTarget.name ||
          'WrapTarget'
        })`

      $ = new StoreSubgroup(
        stores,
        keys,
      )

      rerender = () => (
        new Promise((resolve) => (
          this.mounted
            ? this.setState({})
            : resolve()
        ))
      )

      subscribe = (to = keys) => {
        forEach(to, (key) => {
          stores[key]._subscribers
            .push(this)
        })
      }

      unsubscribe = (from = keys) => {
        forEach(from, (key) => {
          const i = stores[key]._subscribers
            .indexOf(this)
          stores[key]._subscribers.splice(i, 1)
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
          props, $,
          rerender,
          subscribe,
          unsubscribe,
        } = this
        return (
          <WrapTarget
            { ...props }
            $={{
              ...$,
              _: {
                rerender,
                subscribe,
                unsubscribe,
              },
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