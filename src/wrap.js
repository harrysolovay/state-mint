import React, { Component } from 'react'
import { StoreSubgroup, noop } from '~/utilities'

export default (Target, stores, keys) => {

  const $ = new StoreSubgroup(stores, keys)
  let hooks = {}

  return class extends Component {

    static displayName =
      `connect(${
        Target.displayName ||
        Target.name || 'Target'
      })`

    rerender = () => (
      new Promise((resolve) => (
        this.mounted
          ? this.setState({}, resolve)
          : resolve()
      ))
    )

    subscribe = (to = keys) => {
      for (let key of to) {
        stores[key]._subscribers[this._key] = this
      }
    }

    unsubscribe = (from = keys) => {
      for (let key of from) {
        delete stores[key]._subscribers[this._key]
      }
    }

    getTargetProps = () => {

      const {
        props,
        subscribe,
        rerender,
        unsubscribe,
      } = this

      return {
        ...props,
        $: {
          ...$,
          subscribe,
          rerender,
          unsubscribe,
        },
      }
    }

    constructor() {
      super()

      const { lifeCycleHooks } = Target
      const { getTargetProps } = this

      hooks = Object.assign({},
        ...{
          constructor: noop,
          componentDidMount: noop,
          shouldComponentUpdate: () => true,
          componentDidUpdate: noop,
          componentWillUnmount: noop,
        },
        lifeCycleHooks
          ? lifeCycleHooks(
              getTargetProps()
            )
          : {}
      )

      hooks.constructor()
    }

    render() {
      const { getTargetProps } = this
      const props = getTargetProps()
      return <Target { ...props } />
    }

    componentDidMount() {
      this.mounted = true
      this.subscribe()
      hooks.componentDidMount()
    }

    shouldComponentUpdate() {
      return hooks.shouldComponentUpdate()
    }

    componentDidUpdate() {
      hooks.componentDidUpdate()
    }

    componentWillUnmount() {
      this.mounted = false
      this.unsubscribe()
      hooks.componentWillUnmount()
    }
  }
}