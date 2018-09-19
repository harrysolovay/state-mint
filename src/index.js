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
  Persister,
} from '~/utilities'

const {
  Provider,
  Consumer,
} = createContext()

const provide = (WrapTarget, keys) => (props) => (
  <Consumer>
    {(stores) => (
      <WrapTarget
        { ...new StoreSubgroup(stores, keys) }
        { ...props }
      />
    )}
  </Consumer>
)

const consume = (WrapTarget, stores) => (
  class extends Component {

    state = {}
    mounted = false

    constructor () {
      super()

      for (let storeKey in stores) {

        const Store = stores[storeKey]

        Store.prototype.setState = (updater, callback) => {

          const newState = typeof updater === 'function'
            ? updater(this.state[storeKey].state)
            : updater

          if(this.state[storeKey].persistence.save) {
            this.state[storeKey].persistence.save(newState)
          }

          return this.setState((lastState) => ({
            ...lastState,
            [storeKey]: {
              ...lastState[storeKey],
              state: {
                ...lastState[storeKey].state,
                ...newState,
              }
            },
          }), () => {
            if (callback) {
              return callback()
            }
          })

        }

        this.state[storeKey] = new Store()

        const { persistence } = this.state[storeKey]

        if(persistence) {

          const { strategy, fromState, toState } = persistence

          if(!strategy) {
            throw new StateMintError(
              PERSIST_STRATEGY_MISSING,
              storeKey,
            )
          }

          const persistenceMethods = new Persister(strategy)

          this.state[storeKey].persistence.save = (newState) => {
            persistenceMethods.set(
              storeKey,
              fromState
                ? fromState(newState)
                : newState
            )
          }

          persistenceMethods.get(storeKey, (data) => {

            const retrieved = toState
              ? toState(data)
              : data

            if(data) {
              if(this.mounted) {
                this.state[storeKey].setState(() => retrieved)
              } else {
                this.state[storeKey].state = retrieved
              }
            }
          })

        }

        if (!this.state[storeKey].state) {
          this.state[storeKey].state = {}
        }

      }
    }

    render () {
      return (
        <Provider value={ this.state }>
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
    ? provide(WrapTarget, storesOrStoreKeys)
    : consume(WrapTarget, storesOrStoreKeys)
)