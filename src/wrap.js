import React, { Component } from 'react'
import { StoreSubgroup, noop } from '~/utilities'

export default (WrapTarget, keys, stores, ...args) => {

  const $ = new StoreSubgroup(stores, keys)

  return class extends Component {

    static displayName =
      `connect(${
        WrapTarget.displayName ||
        WrapTarget.name ||
        'WrapTarget'
      })`

    lifeCycle = {
      // mounting
      constructor: noop,
      // getDerivedStateFromProps: noop,
      componentDidMount: noop,
      // updating
      shouldComponentUpdate: noop,
      render: noop,
      getSnapshotBeforeUpdate: noop,
      componentDidUpdate: noop,
      // unmounting
      componentWillUnmount: noop,
    }

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

    getWrapTargetProps = ({ subscribe, unsubscribe } = this) => ({
      ...this.props,
      $: {
        ...$,
        subscribe,
        unsubscribe,
      },
    })

    render() {
      const { getWrapTargetProps } = this
      const props = getWrapTargetProps()
      return <WrapTarget { ...props } />
    }

    componentDidMount() {
      this.mounted = true
      this.subscribe()
    }

    componentWillUnmount() {
      this.mounted = false
      this.unsubscribe()
    }
  }
}