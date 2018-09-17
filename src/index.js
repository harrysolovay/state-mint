// eventually flow-type

import React, {
  Component,
  createContext,
} from 'react'

import StateMintError, {
  PERSIST_METHOD_REFERENCE_ERROR,
} from './errors'

import {
  rescope
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

              const newStoreState = typeof updater === 'function'
                ? updater(this.state[storeKey].state)
                : updater

              if(this.state[storeKey].saveState) {
                this.state[storeKey].saveState(newStoreState)
              }

              return this.setState((lastState) => ({
                ...lastState,
                [storeKey]: {
                  ...lastState[storeKey],
                  state: {
                    ...lastState[storeKey].state,
                    ...newStoreState,
                  }
                },
              }), () => {
                if (callback) {
                  return callback()
                }
              })

            }

            this.state[storeKey] = new Store()

            if(this.state[storeKey].persist) {

              const persistMethod = this.state[storeKey].persist[0]
              if(!persistMethod) {
                throw new StateMintError(
                  PERSIST_METHOD_REFERENCE_ERROR,
                  storeKey,
                )
              }

              Object.assign(this.state[storeKey], {

                saveState: (state) => {
                  persistMethod.setItem(
                    storeKey,
                    JSON.stringify(state)
                  )
                },

                retrieveState: () => {
                  return JSON.parse(
                    persistMethod.getItem(
                      storeKey
                    )
                  )
                },

              })

              const retrievedState = this.state[storeKey].retrieveState()
              if(retrievedState) {
                this.state[storeKey].state = retrievedState
              }

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