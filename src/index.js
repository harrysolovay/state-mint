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
  getPersister,
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
          // TODO: ensure points to same memory
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

          // chain the setState & peristence callbacks once for both setters
          return new Promise((resolve) => {

            // two state 'setters':
            // unmounted) direct mutation (allowed within constructor)
            // mounted) works with React.Component.setState

            if(!this.mounted) {
              Object.assign(this.state[storeKey].state, newState)
              resolve()
            }

            else {
              this.setState((lastState) => ({
                ...lastState,
                [storeKey]: {
                  ...lastState[storeKey],
                  state: {
                    ...lastState[storeKey].state,
                    ...newState,
                  },
                },
              }), resolve)
            }

          }).then(() => {

            console.log('from store', this.state[storeKey].state)
            
            const { persistence } = this.state[storeKey]
            if (persistence) {
              const { fromStore } = persistence
              persistence.set(
                storeKey,
                fromStore
                  ? fromStore(newState)
                  : newState
              )
            }

            if (callback) {
              return callback()
            }
          })

        }

        this.state[storeKey] = new Store()

        const { persistence } = this.state[storeKey]

        if(persistence) {

          const { strategy, options, fromStore, toStore } = persistence

          if(!strategy) {
            throw new StateMintError(
              PERSIST_STRATEGY_MISSING,
              storeKey,
            )
          }

          const persister = getPersister(strategy, options)
          Object.assign(this.state[storeKey].persistence, persister)

          // persister.remove(storeKey)

          // this.state[storeKey].setState({
          //   count: 100
          // })

          persister.get(storeKey, (data) => {
            if(data) {
              if(toStore) {
                toStore(data)
              } else {
                this.state[storeKey].setState(() => data)
              }
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