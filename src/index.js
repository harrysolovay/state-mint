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

const provide = (WrapTarget, stores) => (
  class extends Component {

    state = {}
    mounted = false

    constructor () {
      super()

      for (let storeKey in stores) {

        const Store = stores[storeKey]

        Store.prototype.setState = (updater, callback) => {

          // avoid error-throwing operations if state is undefined
          if (!this.state[storeKey].state) {
            this.state[storeKey].state = {}
          }

          // get new state
          const newState = typeof updater === 'function'
            ? updater(this.state[storeKey].state)
            : updater

          // avoid unnecessary operations
          if (JSON.stringify(this.state[storeKey.state]) === JSON.stringify(newState)) {
            return Promise.resolve()
          }

          // TODO: rewrap in way that avoids setState promise w/in a promise
          // React.Component.prototype.setState returns Promise
          // ... we don't want to defy expectations
          return Promise.resolve().then(() => {

            // two state 'setters'
            // unmounted) normal assignment
            // mounted) works with React.Component.setState
            return !this.mounted

              ? (() => {
                this.state = {
                  ...this.state,
                  [storeKey]: {
                    ...this.state[storeKey],
                    state: {
                      ...this.state[storeKey].state,
                      ...newState
                    }
                  }
                }
              })()

              : this.setState((lastState) => ({
                ...lastState,
                [storeKey]: {
                  ...lastState[storeKey],
                  state: {
                    ...lastState[storeKey].state,
                    ...newState,
                  }
                },
              }))

          }).then(() => {
            if (this.state[storeKey].persistence.save) {
              this.state[storeKey].persistence.save(newState)
            }
            if (callback) {
              return callback()
            }
            return
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

          // persistenceMethods.remove(storeKey)

          // this.state[storeKey].setState({
          //   count: 100
          // })

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
              this.state[storeKey].setState(() => retrieved)
            }
            
          })

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
    ? consume(WrapTarget, storesOrStoreKeys)
    : provide(WrapTarget, storesOrStoreKeys)
)