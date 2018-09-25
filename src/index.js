import React, {
  Component,
} from 'react'

import {
  getStoreSubgroup,
} from '~/utilities'

const stores = {}

const callbacksKey = Symbol()

export const initialize = (config) => {
  for (let key in config) {
    if (config.hasOwnProperty(key)) {

      class StoreInheritor extends config[key] {

        setState(updater, callback) {

          const store = stores[key]
          
          const { state: lastState } = store
          
          const newState = typeof updater === 'function'
            ? updater(lastState)
            : updater
  
          const a = JSON.stringify(lastState)
          const b = JSON.stringify(newState)
  
          if (a === b) {
            callback && callback()
            return
          }
  
          stores[key].state = Object.assign({},
            stores[key].state,
            newState,
          )
  
          callback && callback()
  
          stores[key][callbacksKey] &&
            stores[key][callbacksKey]
              .forEach((fn) => fn())
        }

        _addSetStateCallback(callback) {
          if (stores[key][callbacksKey]) {
            stores[key][callbacksKey].push(callback)
          } else {
            stores[key][callbacksKey] = [callback]
          }
        }

        _removeSetStateCallback(callback) {
          stores[key][callbacksKey] = stores[key][callbacksKey]
            .filter((fn) => fn !== callback)
        }

      }

      stores[key] = new StoreInheritor()

      stores[key]._parentScope = stores

    }
  }
}

export const connect = (WrapTarget, keys) => (
  class extends Component {

    static displayName =
      `connect(${
        WrapTarget.displayName ||
        WrapTarget.name
      })`

    stores = keys
      ? getStoreSubgroup(
          stores,
          keys,
        )
      : stores

    update = () => this.setState({})

    constructor() {
      super()

      if (!keys) keys = Object.keys(stores)

      for (let i in keys) {
        if (keys.hasOwnProperty(i)) {
          const key = keys[i]
          if (stores[key]) {
            stores[key]._addSetStateCallback(this.update)
          }
        }
      }
    }

    render() {
      const {
        props,
        stores,
      } = this
      // props.stores && error(PROPS_OVERRIDE_STORES)
      return (
        <WrapTarget
          { ...{
            ...props,
            stores,
          }}
        />
      )
    }

    componentWillUnmount() {
      keys.forEach((key) => {
        stores[key]._removeSetStateCallback(key)
      })
    }

  }
)