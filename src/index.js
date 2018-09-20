// @flow

import React, {
  Component,
  createContext,
} from 'react'

import type {
  ComponentType
} from 'react'

import type {
  storesType
} from './types'

import {
  StoreSubgroup,
  isRunningOnNative,
  PersistMethods,
  isReactComponent,
} from '~/utilities'

import StateMintError, {
  MISSING_FROM_STORE,
  MISSING_TO_STORE,
  PERSIST_STRATEGY_MISSING,
  INVALID_WRAP_TARGET,
  INVALID_MINT_CONFIG,
} from '~/errors'

const {
  Consumer,
  Provider,
} = createContext({})

type WrapTargetType = ComponentType<any>

type consumeConfigType = Array<string>

const consume = (WrapTarget: WrapTargetType, keys: consumeConfigType) => (props: {}) => (
  <Consumer>
    {(stores) => (
      <WrapTarget
        { ...new StoreSubgroup(stores, keys) }
        { ...props }
      />
    )}
  </Consumer>
)

type provideConfigType = {|
  [string]: Class<any>,
|}

type ProviderStateType = {||}

const provide = (WrapTarget: WrapTargetType, config: provideConfigType) => (
  class extends Component<{}, ProviderStateType> {

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
          if (JSON.stringify(this.stores[storeKey].state) === JSON.stringify(newState)) {
            callback && callback()
          }

          // assign new state without pointing to new memory
          Object.assign(this.stores[storeKey].state, newState)

          // trigger re-render
          this.mounted && this.setState({})
          
          // if defined
          const { persist } = this.stores[storeKey]

          // TODO: do this, only if keyword 'state' in Stringified fromState
          // trigger save
          persist && persist()

          // trigger callback
          callback && callback()

        }

        // instanciate
        this.stores[storeKey] = new Store()

        // get truth / configuration object from instance
        const { persist } = this.stores[storeKey]

        // if defined
        if(persist) {

          // get specifics from configuration
          let { strategy, options, fromStore, toStore } = persist

          // can't use one without the other
          if(fromStore || toStore) {
            if(!fromStore) {
              throw new StateMintError(
                MISSING_FROM_STORE,
                storeKey,
              )
            }
            if(!toStore) {
              throw new StateMintError(
                MISSING_TO_STORE,
                storeKey,
              )
            }
          }

          // accept persist as Boolean instead of { ...config }
          // (aka., setting `persist = true` in class definition)
          if (typeof persist === 'boolean') {
            // must pass strategy in React Native
            if (isRunningOnNative()) {
              throw new StateMintError(
                PERSIST_STRATEGY_MISSING,
                storeKey,
              )
            } else {
              // otherwise, default to localStorage
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
            // console.log('should hit', storeKey)
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

type configType =
  | consumeConfigType
  | provideConfigType

const isConsumeConfig = (inQuestion): boolean %checks => {
  return Array.isArray(inQuestion)
}

const isProvideConfig = (inQuestion): boolean %checks => {
  return Object.prototype.toString.call(inQuestion) === '[object Object]'
}

// (might as well modulzarize, used twice below)
const throwWrapTargetError = (key: string) => {
  throw new StateMintError(
    INVALID_WRAP_TARGET,
    key,
  )
}

export default (config: configType) => (WrapTarget: WrapTargetType) => {

  const invalidWrapTarget = !isReactComponent(WrapTarget)

  if (isConsumeConfig(config)) {
    invalidWrapTarget && throwWrapTargetError('storeKeys')
    return consume(WrapTarget, config)
  }

  if (isProvideConfig(config)) {
    invalidWrapTarget && throwWrapTargetError('storesConfig')
    return provide(WrapTarget, config)
  }

  throw new StateMintError(
    INVALID_MINT_CONFIG
  )

}