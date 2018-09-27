import React, {
  Component,
} from 'react'

import {
  forOf,
  forEach,
  isComponent,
} from '~/utilities'

import error from '~/errors'

import persist from './persist'

export default (config) => {

  // ERROR: missing config
  // ERROR: invalid config

  typeof config !== 'object' &&
    error('invalid config')

  const stores = {}

  forOf(config, (key) => {

    typeof config[key] !== 'function' &&
      error('invalid value in config')

    class Store extends config[key] {

      $ = stores
      _listeners = []

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

        const { _listeners } = this
        const pending = _listeners.map((fn) => fn())
        await Promise.all(pending)

        callback && callback()

      }
    }

    stores[key] = new Store()
    
  })

  return (WrapTarget, keys, ...args) => {

    !WrapTarget &&
      error('missing WrapTarget')

    !isComponent(WrapTarget) &&
      error('invalid WrapTarget')

    !keys &&
      error('missing keys')

    !Array.isArray(keys) &&
      error('invalid keys')

    args.length > 0 &&
      error('too many args!')

    return class extends Component {

      static displayName =
        `connect(${
          WrapTarget.displayName ||
          WrapTarget.name
        })`

      rerender = () => (
        new Promise((resolve) => (
          this.mounted
            ? this.setState({})
            : resolve()
        ))
      )

      subscribe = (to = keys) => {
        forEach(to, (key) => {
          stores[key]._listeners
            .push(this.rerender)
        })
      }

      unsubscribe = (from = keys) => {
        forEach(from, (key) => {
          const i = stores[key]._listeners
            .indexOf(this.renderer)
          stores[key]._listeners.splice(i, 1)
        })
      }

      constructor(props) {
        super()
        const { $ } = props
        $ && error('overriding stores')
      }

      render() {
        return (
          <WrapTarget
            { ...this.props }
            $={
              Object.assign({},
                ...keys.map((key) => ({
                  [key]: stores[key],
                }))
              )
            }
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