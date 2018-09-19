// eventually flow-type

import React, {
  Component,
  createContext,
} from 'react'

import StateMintError, {
  PERSIST_STRATEGY_MISSING,
} from '~/errors'

import {
  StoreSubgroup,
  PersistMethods,
  runningOnNative,
} from '~/utilities'

const {
  Provider,
  Consumer,
} = createContext()

const consume = (WrapTarget, keys) => (props) => (
  <Consumer>
    {(stores) => (
      <WrapTarget
        { ...new StoreSubgroup(stores, keys) }
        { ...props }
      />
    )}
  </Consumer>
)

const provide = (WrapTarget, config) => (
  class extends Component {

    stores = {}
    mounted = false

    constructor () {
      super()

      for (let storeKey in config) {

        const Store = config[storeKey]

        Store.prototype.setState = (updater, callback) => {

          // avoid error-throwing operations if state is undefined
          if (!this.stores[storeKey].state) {
            this.stores[storeKey].state = {}
          }

          // get new state
          const newState = typeof updater === 'function'
            ? updater(this.stores[storeKey].state)
            : updater

          // avoid unnecessary operations if store data unchanged
          if (JSON.stringify(this.stores[storeKey.state]) === JSON.stringify(newState)) {
            return callback && callback()
          }

          Object.assign(this.stores[storeKey].state, newState)

          // trigger re-render
          if (this.mounted) this.setState({})
          
          // if defined
          const { persist } = this.stores[storeKey]

          // Todo: figure out if state is even referenced in fromStore method
          // trigger save
          if (persist) {
            persist()
          }

          // TODO: compare & re-write to match React.Component.setState return
          // ...however, avoid fake Promise response (dead weight)
          return callback && callback()

        }

        this.stores[storeKey] = new Store()

        // get configuration object from instance
        const { persist } = this.stores[storeKey]

        if(persist) {

          // get specifics from configuration
          let { strategy, options, fromStore, toStore } = persist

          // accept persist without config (aka. `persist = true`)
          if (typeof persist === 'Boolean') {
            // must pass strategy in React Native
            if (runningOnNative) {
              throw new StateMintError(
                PERSIST_STRATEGY_MISSING,
                storeKey,
              )
            } else {
              // default to localStorage
              strategy = window.localStorage
            }
          }

          // create persist methods ({ set, get, remove })
          const persistMethods = new PersistMethods(strategy, options)

          // override user-defined persist settings
          Object.assign(this.stores[storeKey], {
            // ...with the configured persist save trigger
            persist: () => {
              persistMethods.set(
                storeKey,
                fromStore
                  ? fromStore()
                  : this.stores[storeKey].state
              )
            }
          })

          // persistMethods.remove(storeKey)

          persistMethods.get(storeKey, (data) => {
            if(data) {
              if(toStore) {
                toStore(data)
              } else {
                this.stores[storeKey].setState(data)
              }
            }
          })

        }
      }
    }

    render () {
      return (
        <Provider value={ this.stores }>
          <WrapTarget { ...this.props } />
        </Provider>
      )
    }

    componentDidMount () {
      this.mounted = true
    }

  }
)

export default (storesOrStoreKeys) => (WrapTarget) => (
  // swap out with better typechecking
  Array.isArray(storesOrStoreKeys)
    ? consume(WrapTarget, storesOrStoreKeys)
    : provide(WrapTarget, storesOrStoreKeys)
)