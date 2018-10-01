import React, { Component } from 'react'
import {
  isStatefulComponent,
  StoreSubgroup,
  createUniqueId,
  noop,
} from '~/utilities'
import error from '~/errors'

let shouldThrow = false

export default (Target, stores, keys) => {

  shouldThrow = !!(isStatefulComponent(Target) && Target.lifeCycleHooks)
  error(shouldThrow, 'LIFECYCLE_HOOKS_IN_STATEFUL_COMPONENT')

  if (!keys) {
    const fnAsString = String(Target)
    keys = Object
      .keys(stores)
      .filter((key) => fnAsString.includes(`$.${ key }`))
  }

  const $ = new StoreSubgroup(stores, keys)
  const hooks = {}

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

      this._key = createUniqueId()

      this.subscribe()

      const { lifeCycleHooks } = Target
      const { getTargetProps } = this

      Object.assign(hooks,
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