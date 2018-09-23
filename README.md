<div align="center">
<h1>State Mint 🌿</h1>
"Mint: A place where money is coined, especially under state authority." Oxford English Dictionary
<br><br>
</div>
<hr />

[![MIT License][license-badge]][license]
[![version][version-badge]][package]
[![PRs Welcome][prs-badge]][prs]
[![Build Status][build-badge]][build]

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Why?](#why)
  - [the goal](#the-goal)
  - [the reality](#the-reality)
  - [the history](#the-history)
  - [the horror](#the-horror)
- [This solution](#this-solution)
- [Installation](#installation)
- [Usage](#usage)
  - [basic](#basic)
  - [persisting data](#persisting-data)
  - [set persistence strategy:](#set-persistence-strategy)
  - [define exact data to persist:](#define-exact-data-to-persist)
  - [trigger persist manually:](#trigger-persist-manually)
- [FAQ (or infrequently / never yet asked)](#faq-or-infrequently--never-yet-asked)
  - [How can I use `setState` without extending another class where `setState` is defined?](#how-can-i-use-setstate-without-extending-another-class-where-setstate-is-defined)
  - [But, is it slow to attach the `setState` method to each store class prototype?](#but-is-it-slow-to-attach-the-setstate-method-to-each-store-class-prototype)
  - [Why does it use React's Context API?](#why-does-it-use-reacts-context-api)
  - [What's next?](#whats-next)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why?

### the goal
State management and persistence shouldn't require the learning of new conventions; React developers are familiar with HOCs and Component.setState. Store implementations should involve as little library code as possible, and allow users to focus on defining their data and actions, without excessive boilerplate or 3rd-party middleware.

### the reality
A breif disclaimer before I dive into shortcomings of popular alternatives: opinionated state management often simplifies debugging and collaboration. Once a project reaches ~5,000 lines, chances are that you're thinking about how to enforce rules for consistency and maintainability. However, you might want to tackle this problem in a way more suited to your project needs and code style. A lot of the time, this will differ from de facto approaches.

### the history
Before React came onto the scene, global state management was, for many projects, somewhat of an afterthought. For simple websites, one might hastily throw global state into the window object. Nowadays, for the sake of enabling smooth application evolution, state management needs to eliminate the possibility of accidental overwrites. Redux and React's Context API do this beautifully by making use of ES6 Symbols. Their functional approaches simplify otherwise complex data pipelines, and make it possible to use back-tracking middleware. However, the look of their implementations can be somewhat horrific.

### the horror

***[Redux](https://github.com/reduxjs/redux):*** Conventional Redux requires that you separate action types from their logic, logic from its data, and data from its triggering of subsequent actions. Depending on how you like to work, this decoupling is either the best or the worst approach (if you lay in the middle, chances are [you might not need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)).

***[MobX](https://github.com/mobxjs/mobx):*** comes in a few different flavors. Classic MobX is a step in a less opinionated and more object-oriented direction. On the downside, it forces users to specify which store members are observable, which is a new convention (in React, by default, a Component's state member is observable, and using setState will trigger a rerender that uses the new state data). MobX's approach does not make use of React's pre-existing re-render trigger, which could be seen as a bit of a waste. MobX also encourages explicit mutation, which is a React anti-pattern. Meanwhile, ...

***[MobX State Tree](https://github.com/mobxjs/mobx-state-tree)*** could be described as having the best of both mutability and immutability (reactive variable assignment, back-tracking & snapshot debugging). It let's you nest store data in a way that scales, and your models always stay in sync... but its implimentation is opinionated, cluttered and unattractive.

***[Apollo Link State](https://github.com/apollographql/apollo-link-state):*** If your app interfaces with a GraphQL server, this could be a good solution. The Apollo ecosystem is vibrant and rapidly evolving. Apollo Link State gives users a strong API for syncing fetched data in memory and offline persistence. However, it's also very opinionated, and unless you're already using Apollo Client, it probably isn't the best solution.

***[Unstated](https://unstated.io):*** as far as alternatives go, Unstated is the least opinionated with the lowest learning curve. The underlaying mechanism is pretty cool: behind the scenes, stores are initialized inside a Consumer, which then passes the store data to the provider, which then passes the data to all store Consumers. This pattern is cool, but a little hackey, and results in extra operations with each update. It also means you need to use the Store contructor as a key to the instance, (no support for multiple instances of the same Store). Another disadvantage is that data can only be accessed within a render method (aka. no store usage in lifecycle methods) without a user-defined HOC.


## This solution

#### overview
State Mint makes use of React 16.3's Context API (using a single context for all stores). Define your Stores as classes and use `state` and `setState` just as you would when extending React.Component. For all intensive purposes, there's no difference in the state's usage, except that you're allowed to call setState from within the constructor if you so choose. You use the same function to initialize your stores as you do to connect them to your components. This function is the default export of the `state-mint` package, so feel free to name it whatever you'd like. For the purposes of this documentation, we'll be calling that function `mint`. Data persistance is optional, yet it's so easy to enable, that there's rarely a reason not to do so (might as well support offline users).

#### Features to highlight
* store instances have easy access to other store instances
* create multiple instances of the same Store
* components are connected via props, so you can use in lifecycle methods without a custom HOC
* use a variety of persistance strategies (without re-implimentation):
	* window.localStorage (in Browser)
	* window.sessionStorage (in Browser)
	* document.cookie (in Browser)
	* AsyncStorage (in React Native)
	* SecureStore (in React Native)

## Installation

The `state-mint` package is available on the [npm][npm] registry and includes the library in both a cjs and esm format.

```
npm install state-mint
```

## Usage

### basic

#### First, define your store as a class:

`~/src/stores/Counter.js`

```js
export default class Counter {

  state = { count: 0 }

  increment = () => {
    this.setState((lastState) => ({
    	count: lastState.count + 1,
    }))
  }

  decrement = () => {
    this.setState((lastState) => ({
    	count: lastState.count - 1,
    }))
  }

}
```

#### Next, 'mint' your app with your store(s) from the a level that encapsulates all store-dependent child components (or 'mint' your root component, just to be safe):

`~/src/index.js`

```js
import React from 'react'
// we'll define this component in the next step:
import CounterComponent from './components/Counter.js'
import mint from 'state-mint'
import CounterStore from './stores/Counter.js'
import { render } from 'react-dom'

const App = () => (
  <div>
    <CounterComponent />
  </div>
)

// mint your App component
const MintedApp = mint({
  counter: CounterStore,
  // we could include other stores here
})(App)

render(<App />, document.getElementById('root'))
```

`~/src/components/Counter.js`

#### Finally, connect your component(s) to the data:

```js
// define the Counter component
const Counter = (props) => {

  // 'counter' store data will be passed in through props.stores.counter
  const { counter } = props.stores
  const { state, increment, decrement } = counter

  return (
    <div>
      <button onClick={ decrement }>subtract</button>
      <span>{ state.count }</span>
      <button onClick={ increment }>increment</button>
    </div>
  )
}

// mint takes in an array of all stores to which the given component should have access
export default mint(['counter'])(Counter)
```

### persisting data
#### defaults to persisting the entire state object with localStorage

```diff
export default class Counter {

  state = { count: 0 }
  
+ persist = true

  increment = () => {
    this.setState((lastState) => ({
    	count: lastState.count + 1,
    }))
  }

  decrement = () => {
    this.setState((lastState) => ({
    	count: lastState.count - 1,
    }))
  }

}
```

### set persistence strategy:
#### still defaults to persisting the entire state object, but uses your choice of persistence strategy

```diff
export default class Counter {

  state = { count: 0 }
  
+ persist = { strategy: window.sessionStorage }

  increment = () => {
    this.setState((lastState) => ({
    	count: lastState.count + 1,
    }))
  }

  decrement = () => {
    this.setState((lastState) => ({
    	count: lastState.count - 1,
    }))
  }

}
```

### define exact data to persist:
#### we don't always want to persist the entire state, and sometimes we want to persist data outside of state

In this case, we want to persist info about the user, but we don't want to persist whether or not to show the bio.

```diff
const DEFAULT_STATE = {
  loggedIn: false,
  username: null,
  bio: null,
  bioShowing: false,
}

export default class Account {

  state = { ...DEFAULT_STATE }

  persist = {

    strategy: window.localStorage,

	 // return an object containing the data you wish to persist
+   fromStore: () => {
+     const { bioShowing, ...user } = this.state
+     return user
+   },

	 // when persisted data gets retrieved, place it where it goes
+   toStore: (persistedData) => {
+     this.setState((lastState) => ({
+       ...lastState,
+       ...persistedData,
+     }))
+   },

  }

  logIn = () => {
    this.setState((lastState) => ({
      ...lastState,
      loggedIn: true,
      username: 'harrysolovay',
      bio: 'I really like State Mint!',
    }))
  }

  toggleBioShowing = () => {
    this.setState((lastState) => ({
      ...lastState,
      bioShowing: !lastState.bioShowing,
    }))
  }

  logOut = () => {
    this.setState(DEFAULT_STATE)
  }

}
```

### trigger persist manually:
with each setState call, your data will be persisted if the following conditions are true:

* the newState is different from the lastState
* your persist configuration makes reference to state (you might not touch state in persist.toState and persist.fromState, in which case state and persisted data are kept separate)

To trigger a new persist, independent of setState, simply call `this.persist()` from within your store. It won't trigger a re-render, but it will save the data to your chosen or the default strategy.

```diff
export default class SomeToggle {

  outOfStateBoolean = false

  persist = {

    strategy: window.localStorage,

	 // return an object containing the data you wish to persist
    fromStore: () => {
      const { outOfStateBoolean } = this
      return outOfStateBoolean
    },

	 // when persisted data gets retrieved, place it where it goes
    toStore: (persistedData) => {
      this.outOfStateBoolean = persistedData
    },

  }

  toggle = () => {
    this.outOfStateBoolean = !this.outOfStateBoolean
+   this.persist()
  }

}
```



## FAQ (or infrequently / never yet asked)

### How can I use `setState` without extending another class where `setState` is defined?

Before your store is constructed, the `setState` method is attached to the class prototype.

### But, is it slow to attach the `setState` method to each store class prototype?

No, quite the oposite actually. When you inherit from a class with a pre-defined method, the inheritence chain (contrary to what you might think) is not precompiled. This means that inheriting will result in a series of checks helper and functions being executed at runtime. It's lighter to attach the `setState` method.

### Why does it use React's Context API?

For the sake of not overestimating my foresight. Athough I might soon ditch the Context API, therefore making this library work in projects using a version of React below 16.3, as well as for non-react projects!

### What's next?

I want to create a `babel-plugin-state-mint` package that allows you to use statemint with even less code. You would decorate your store class, which would make it available to your components. Within a component, you could simply reference `this.props.stores.storeName` or `props.stores.storeName`, and the plugin would (behind the scenes) 'mint' the component with the storeKeys that it referenced. It would also find the lowest-level node that contains all store-referencing components, and 'mint' it with all of the decorated stores. I want 'mint' to be the only thing ever accessed from the `state-mint` package.

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/harrysolovay/state-mint.svg?style=flat-square
[build]: https://travis-ci.org/harrysolovay/state-mint
[version-badge]: https://img.shields.io/npm/v/state-mint.svg?style=flat-square
[package]: https://www.npmjs.com/package/state-mint
[downloads-badge]: https://img.shields.io/npm/dm/state-mint.svg?style=flat-square
[license-badge]: https://img.shields.io/npm/l/state-mint.svg?style=flat-square
[license]: https://github.com/harrysolovay/state-mint/blob/master/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com