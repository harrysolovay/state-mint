// @flow

import React, {
  Component,
  createContext,
} from 'react'

import type {
  ComponentType,
} from 'react'

import {
  StoreSubgroup,
  isRunningOnNative,
  PersistMethods,
  isReactComponent,
} from '~/utilities'

import StateMintError, {
  MISSING_FROM_STORE,
  MISSING_TO_STORE,
  MISSING_PERSIST_STRATEGY,
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


const provide = (WrapTarget: WrapTargetType, config: provideConfigType) => (
  class extends Component<{}, {||}> {

    stores = {}
    mounted = false

    constructor() {
      super()

      for (let storeKey in config) {
        if (config.hasOwnProperty(storeKey)) {

          const Store = config[storeKey]
          
          Store.prototype.setState = (
            updater: {} | (lastState: {}) => {},
            callback?: () => {},
          ) => {

            // get references to self
            const store = this.stores[storeKey]
            const { state: lastState, persist } = store

            // get the new state
            const newState = typeof updater === 'function'
              ? updater(lastState)
              : updater

            // avoid unnecessary operations if store data unchanged
            if (JSON.stringify(lastState) === JSON.stringify(newState)) {
              callback && callback()
              return
            }

            // assign new state without pointing to new memory
            Object.assign(store, { state: newState })

            // trigger re-render
            this.mounted && this.setState({})

            // trigger callback
            callback && callback()
            
            // trigger persist if persist.fromStore doesn't exclude state
            persist && persist._referencesState && persist()

          }

          // instanciate & gather references
          const store = new Store()
          this.stores[storeKey] = store
          const { persist } = store

          // if defined
          if (persist) {

            let strategy

            // accept persist as Boolean instead of { ...config }
            // (aka., setting `persist = true` in class definition)
            if (typeof persist === 'boolean') {
              // must pass strategy in React Native
              if (isRunningOnNative()) {
                throw new StateMintError(
                  MISSING_PERSIST_STRATEGY,
                  storeKey,
                )
              } else {
                // otherwise, default to localStorage
                strategy = window.localStorage
              }
            } else {
              ({ strategy } = persist)
            }

            // get specifics from configuration
            let { fromStore, toStore, options } = persist

            // can't use one without the other
            if (
              (fromStore || toStore) &&
              !(fromStore && toStore)
            ) {
              throw new StateMintError(
                fromStore
                  ? MISSING_TO_STORE
                  : MISSING_FROM_STORE,
                storeKey,
              )
            }

            // create persist methods ({ set, get, remove })
            const persistMethods = new PersistMethods(strategy, options)

            // override user-defined persist settings
            // ...with the configured persist save trigger
            store.persist = () => {
              persistMethods.set(
                storeKey,
                fromStore
                  ? fromStore()
                  : store.state
              )
            }

            // only trigger persist with setState if persisting state,
            // aka. users might persist instance vars other than state
            const _referencesState = (
              !fromStore ||
              String(fromStore).includes('this.state')
            )

            Object.assign(store.persist, {
              ...persist,
              _referencesState,
            })

            // fetch persisted data
            persistMethods.get(storeKey, (data) => {
              console.log(storeKey, store.state)
              if (data) {
                toStore
                  ? toStore(data)
                  : store.setState(data)
              }
            })

          }
        }
      }
    }

    render() {
      return (
        <Provider value={ this.stores }>
          <WrapTarget { ...this.props } />
        </Provider>
      )
    }

    componentDidMount() {
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