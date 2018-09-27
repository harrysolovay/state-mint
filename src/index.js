import React, {
  Component,
} from 'react'

import {
  forOf,
  forEach,
} from '~/utilities'

import persist from './persist'

export default (config) => {

  const stores = {}

  forOf(config, (key) => {

    class Store extends config[key] {

      constructor() {
        super()
        
        this.persist &&
          persist(this, key)
      }

      setState(updater, callback) {

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

        const { _listeners: callbacks } = this
        callbacks && forEach(callbacks, (fn) => fn())

        const { persist } = this
        const { _referencesState } = persist
        persist && _referencesState && persist()

        callback && callback()

      }

    }

    stores[key] = new Store()
    
  })

  return (WrapTarget, keys) => {

    console.log(WrapTarget, keys)

    return class extends Component {

      static displayName =
        `connect(${
          WrapTarget.displayName ||
          WrapTarget.name
        })`

      rerender = () => this.setState({})

      subscribe = (to = keys) => {
        if (!this.subscribed) {
          forEach(to, (key) => {
            if (stores[key]._listeners) {
              stores[key]._listeners.push(this.rerender)
            } else {
              stores[key]._listeners = [this.rerender]
            }
          })
          this.subscribed = true
        }
      }

      unsubscribe = (from = keys) => {
        if (this.subscribed) {
          forEach(from, (key) => {
            stores[key]._listeners = stores[key]._listeners
              .filter((fn) => fn !== this.rerender)
          })
          this.subscribed = false
        }
      }

      constructor() {
        super()
        this.subscribe()
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

      componentWillUnmount() {
        this.unsubscribe()
      }

    }
  }

}