// eventually flow-type

import React, {
  Component,
  createContext,
} from 'react'

import StateMintError, {
  PERSIST_STRATEGY_MISSING,
} from './errors'

import {
  rescope,
  PersistenceMethods,
} from './utilities'

const {
  Provider,
  Consumer,
} = createContext()

export default (storesOrStoreKeys) => (WrapTarget) => (

  // swap out with better typechecking
  Array.isArray(storesOrStoreKeys)

    ? (props) => (
      <Consumer>
        {(stores) => (
          <WrapTarget
            stores={ rescope(stores, storesOrStoreKeys) }
            { ...props }
          />
        )}
      </Consumer>
    )

    : (
      class extends Component {

        state = {}

        constructor () {
          super()

          for (let storeKey in storesOrStoreKeys) {

            const Store = storesOrStoreKeys[storeKey]

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

              const persistenceMethods = new PersistenceMethods(strategy)

              this.state[storeKey].persistence.save = (newState) => {
                persistenceMethods.set(
                  storeKey,
                  fromState
                    ? fromState(newState)
                    : newState
                )
              }

              persistenceMethods.get(storeKey, (data) => {
                if(data) {
                  this.state[storeKey].state = toState
                    ? toState(data)
                    : data
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

      }
    )
)