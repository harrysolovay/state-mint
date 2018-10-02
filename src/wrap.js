import React, { Component } from 'react'
import {
  isStatefulComponent,
  isFunctionalComponent,
  getStoreSubgroup,
  noop,
} from '~/utilities'
import error, {
  LIFECYCLE_HOOKS_ON_STATEFUL,
  INVALID_STORE_KEYS,
  NONEXISTENT_STORE_KEY,
  OVERRIDING_$_PROP,
  INVALID_LIFECYCLE_HOOKS,
} from '~/errors'

export default (stores, consumers, Target, keys) => {

  error(
    !!(isStatefulComponent(Target) && Target.lifeCycleHooks),
    LIFECYCLE_HOOKS_ON_STATEFUL,
  )

  if (keys) {
    error(!Array.isArray(keys), INVALID_STORE_KEYS)
    for (let key of keys) {
      error(!Object.keys(stores).includes(key), NONEXISTENT_STORE_KEY)
    }
  }

  if (!keys) {

    var analyze = []

    if (isStatefulComponent(Target)) {
      const proto = Target.prototype
      const contained = Object
        .getOwnPropertyNames(proto)
        .map((key) => proto[key])
      analyze = [ ...analyze, ...contained ]
    }

    if (isFunctionalComponent(Target)) {
      let contained = [ Target ]
      if (Target.lifeCycleHooks) {
        const mock = Target.lifeCycleHooks({ $: {} })
        contained = [ ...contained, ...Object.values(mock) ]
      }
      analyze = [ ...analyze, ...contained ]
    }

    var inferSubscriptions = () => {
      const allStoreKeys = Object.keys(stores)
      return analyze.map((e) => {
        const asString = String(e)
        for (let key of allStoreKeys) {
          if (asString.includes(`$.${ key }`)) {
            return key
          }
        }
        return null
      }).filter(Boolean)
    }

  }

  const hooks = {}

  return class extends Component {

    static displayName =
      `connect(${
        Target.displayName ||
        Target.name || 'Target'
      })`

    bridge = () => {
      const subscriptions = inferSubscriptions
        ? inferSubscriptions()
        : keys
      const $ = getStoreSubgroup(stores, subscriptions)
      Object.assign(this, { subscriptions, $ })
      return subscriptions
    }

    rerender = () => (
      new Promise((resolve) => (
        this.mounted
          ? this.setState({}, resolve)
          : resolve()
      ))
    )

    subscribe = (to) => {
      if (!to) to = this.bridge()
      for (let key of to) {
        stores[key]._subscribers[this._key] = this
      }
    }

    unsubscribe = (from) => {
      if (!from) from = this.subscriptions
      for (let key of from) {
        delete stores[key]._subscribers[this._key]
      }
    }

    getTargetProps = () => {

      const {
        props, $,
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

    onNewStore = () => {
      const { mounted, subscriptions } = this
      if (mounted && !keys && subscriptions) {
        const { subscribe, rerender } = this
        subscribe()
        subscriptions !== this.subscriptions &&
          rerender()
      }
    }

    constructor(props) {
      super()

      let { $ } = props
      error(!!$, OVERRIDING_$_PROP)

      this.subscribe()

      const { lifeCycleHooks } = Target
      const { getTargetProps } = this

      error(
        !!(lifeCycleHooks && typeof lifeCycleHooks !== 'function'),
        INVALID_LIFECYCLE_HOOKS
      )

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

      consumers.push(this)

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