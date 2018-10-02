<div align="center">
<h1>State Mint 🌿</h1>
</div>


<h1 align='center'>
  <img src='logo.png' alt='State Mint' />
</h1>


<!-- LICENSE -->

<p align='center'>

<a href='https://github.com/harrysolovay/state-mint/blob/master/LICENSE'>
  <img src='https://img.shields.io/npm/l/state-mint.svg?style=flat-square' />
</a>

<!-- NPM -->
<a href='https://www.npmjs.com/package/state-mint'>
  <img src='https://img.shields.io/npm/v/state-mint.svg?style=flat-square' />
</a>

<!-- Build -->
<a href='https://travis-ci.org/harrysolovay/state-mint'>
  <img src='https://img.shields.io/travis/harrysolovay/state-mint.svg?style=flat-square' />
</a>

<!-- PRs -->
<a href='http://makeapullrequest.com'>
  <img src='https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square' />
</a>

<!-- FORMATS -->
<a href='https://unpkg.com/state-mint/lib/'>
  <img src='https://img.shields.io/badge/module%20formats-umd%2C%20cjs%2C%20es-green.svg?style=flat-square' />
</a>

<!-- gzipped -->
<a href='https://unpkg.com/state-mint/lib/'>
  <img src='http://img.badgesize.io/https://unpkg.com/state-mint/lib/state-mint.es.js?compression=gzip&label=gzip%20size&style=flat-square' />
</a>

</p>

<hr />

> **A state layer that keeps your React project fresh 🌿**
> Designed for React developers, State Mint is a boilerplate-free state management and persistence solution with spectacular performance and the best-available developer experience. Click [here](https://reactjs.org/docs/render-props.html) to read about the process of creating State Mint, and about its future direction (feel free to PR).

<details>
<summary>view minimal example implementation</summary>

```js
import React from 'react'
import mint from 'state-mint'
import { render } from 'react-dom'

// define the store as an ES6 class:
class ModalStore {
  
  state = { showingModal: false }
    
  toggleModal = () =>
    this.setState({
      showingModal: !this.showingModal,
    })
    
}

// 'mint' your store(s)
mint({ modal: ModalStore })

// define a component that uses the 'modal' store (props.$.modal)
const UnconnectedModal = (props) => {
  const { $: { modal } } = props
  const { state: { showingModal }, toggleModal } = modal
  return (
    <div>
      { showingModal && <div>modal contents</div> }
      <button onClick={ toggleModal }>
      	{ showingModal ? 'hide' : 'show' }
      </button>
    </div>
  )
}

// 'mint' a component...
// because `UnconnectedModal` references props.$.modal,
// State Mint will––when connecting the component)––infer
// that your Component should rerender on ('or subscribe to')
// state changes in the modal store
const ConnectedModal = mint(UnconnectedModal)

render(<ConnectedModal />, document.getElementById('root'))
```

</details>

## Highlights
- 🤯 use all features without visibly touching more than a single, one-parameter function from this library

- 🧛‍♂️ highly configurable data persistence with [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) on web, and [async storage](https://facebook.github.io/react-native/docs/asyncstorage) and [secure store](https://docs.expo.io/versions/latest/sdk/securestore) on React Native

- 👂 components are intelligently subscribed to listen for changes in the data they reference (or, you can specify subscriptions)

- 🎯 stores can directly access oneanother's data (define store data relative to other stores, trigger rerenders of subscribed components, ... even subscribe stores to other stores!)

- 🎩 store instances can be initialized and connected to components asynchronously

- 😷 keep your state safe from direct mutation with a re-implemented, data-persisting setState, which can be used identically to React's Component.setState

- 🎣 add lifecycle hooks to functional components with no additional HOC

  **other things that're good to have...**

- 🔐 Flow & TypeScript typings

- 👩‍👧‍👦 no dependencies

- 📦 under 3kbs gzipped

- 🍻 plays nice with older versions React


## Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Quick Start](#quick-start)
- [Why?](#why)
- [Intro](#intro)
- [Usage](#usage)
- [FAQ (or infrequently / never yet asked)](#faq-or-infrequently--never-yet-asked)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

### available through the NPM registry

```sh
yarn add state-mint
```

### build formats

CommonJS

```js
const mint = require('state-mint').default
```

ES Module

```js
import mint from 'state-mint'
```

UMD

```js
var mint = window.StateMint.default
```


## Quick Start

```jsx
import React from 'react'
import mint from 'state-mint'
import { render } from 'react-dom'

// define your store class
// setState will trigger rerenders when & where appropriate
class Counter {

  state = { count: 0 }

  increment = () =>
    this.setState({ count: this.state.count + 1 })

  decrement = () =>
    this.setState({ count: this.state.count - 1 })

}

// 'mint' takes in an object with keyed store classes...
mint({ counter: Counter })

// once the store has been initialized ^, use mint again to wrap a component that uses the counter store
const App = mint((props) => {

  const { $: { counter }} = props
  const { state: { count }, increment, decrement } = counter

  return (
    <div>
      <button onClick={ decrement }>decrement</button>
      <span>{ count }</span>
      <button onClick={ increment }>increment</button>
    </div>
  )
})

render(<App />, document.getElementById('root'))

```

To use the counter store in other modules, import 'mint' again and wrap the component that needs access:

`some-other-file.js`

```jsx
import mint from 'state-mint'

const AnotherCounterComponent = mint((props) => {
  const { $: { counter: { state: { count } } } }
  return <div>{ count }</div>
})
```

Asynchronously:

```js
import yourAPI from '...'
import mint from 'state-mint'
import ParticipantStore from '~/stores'

yourAPI.fetchPlayers().then((players) => {

  let additions = {}
  
  players.forEach((player) => {
    additions[player.id] = ParticipantStore
  })
  
  mint(morePlayers)
  
})
```

## Why?

### the ideal
State management and persistence shouldn't require the learning of new conventions; React developers are familiar with HOCs (higher-order components) and Component.setState. State management libraries should allow implementations to involve as little library code as possible, and allow users to focus on defining their data and actions, without excessive boilerplate or 3rd-party plugins and middleware.

### the reality
Opinionated state management often simplifies debugging and collaboration. Once a project reaches ~5,000 lines, chances are that you're thinking about how to enforce rules for consistency and maintainability. However, you might want to tackle this problem in a way more suited to your project needs and coding style. A lot of the time, this will differ from de facto approaches.

### the history
Before React came onto the scene, global state management was, for many projects, somewhat of an afterthought. For simple websites, one might hastily throw global state into the window object. Nowadays, for the sake of enabling smoother application evolution, state management needs to eliminate the possibility of overwrites––usually through careful scoping or synthetic immutability ("synthetic" because JavaScript is not a functional programming language). Tools that take a functional approach to state management can simplify otherwise complex data pipelines, and make it possible to use back-tracking middleware (not to mention keep you safe from stack trace hell). However, the look of existing implementations is horrific.

### the horror


***[Redux](https://github.com/reduxjs/redux) :*** Conventional Redux requires that you separate action types from their logic, logic from its data, and data from its triggering of subsequent actions. Depending on how you like to work, this decoupling is either the best or the worst approach (if you lay in the middle, chances are [you might not need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367)).

***[MobX](https://github.com/mobxjs/mobx):*** comes in a few different flavors. Classic MobX is a step in a more intuitive and object-oriented direction. On the downside, it forces users to specify which store members are observable, which is a new convention (in React, by default, a Component's state member is observable, and using setState will trigger a rerender that uses the new state data). This being said, the new convention does lead to a performance gain by haulting unnecessary rerenders in your DOM tree. MobX encourages explicit mutation, which is a React anti-pattern. Meanwhile, ...

***[MobX State Tree](https://github.com/mobxjs/mobx-state-tree)*** could be described as having the best of both mutability and immutability (reactive variable assignment, back-tracking & snapshot debugging). It let's you nest store data in a way that scales, and your models always stay in sync... but its implimentation is opinionated, cluttered and unattractive.

***[Apollo Link State](https://github.com/apollographql/apollo-link-state):*** If your app interfaces with a GraphQL server, this could be a good solution. The Apollo ecosystem is vibrant and rapidly evolving. Apollo Link State gives users a strong API for syncing fetched data in memory and offline persistence. However, it's also very opinionated, and unless you're already using Apollo Client, it probably isn't the best solution.

***[Unstated](https://unstated.io):*** as far as alternatives go, Unstated is the least opinionated with the lowest learning curve. The underlaying mechanism is pretty cool: behind the scenes, stores are initialized inside a Consumer, which then passes the store data to its parent provider, which then passes the data to all store Consumers. This pattern is cool, but a little hackey, and results in extra operations with each update. It also means you need to use the Store contructor as a key to the instance, (no support for multiple instances of the same Store). Another disadvantage is that data can only be accessed within a render method (aka. no store usage in lifecycle methods) without a user-defined HOC. Plus, using the ContextAPI means that any operation that updates the state of any store will trigger a re-render of all mounted "connected" components.


## Intro

### overview

1. Define your Stores as classes and use `state` and `setState` just as you would when extending React.Component. For all intensive purposes, there's no difference in their usage.

2. Call the default export (a function) of the `state-mint` package with your Store class constructors as values in a config object.

3. Use the returned function from the last step to connect your components to your stores.

4. Use the same function from step 3 to asynchronously load new stores and connect new components.


### Features to highlight
* store instances have easy access to other store instances
* create multiple instances of the same Store
* components are connected via props, so you can use in lifecycle methods without a custom HOC
* use a variety of persistance strategies (without re-implimentation):
	* window.localStorage (in Browser)
	* window.sessionStorage (in Browser)
	* document.cookie (in Browser)
	* AsyncStorage (in React Native)
	* SecureStore (in React Native)

## Usage

### basic

#### First, define your store as a class:

`~/src/stores/Counter.js`

​```js
export default class Counter {

  state = { count: 0 }

  increment = () => {
​    this.setState((lastState) => ({
​    	count: lastState.count + 1,
​    }))
  }

  decrement = () => {
​    this.setState((lastState) => ({
​    	count: lastState.count - 1,
​    }))
  }

}
```

#### Next, 'mint' your app with your store(s) from the a level that encapsulates all store-dependent child components (or 'mint' your root component, just to be safe):

`~/src/index.js`

​```jsx
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

```jsx
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



## FAQ

**Q)** How can I use `setState` in my store without extending another class where `setState` is defined?<br />
**A)** Before `mint` constructors your store, the `setState` method is attached to the class prototype (precompiled, it defines a new class that extends yours). Although your class doesn't have a setState method upon its initial definition, it will upon runtime.

**Q)** Why doesn't it use React's Context API?<br />
**A)** While React@^16.3 Context is polyfilled for older versions or react, I wanted State Mint to work without the version or peer dependency. Plus, using React Context would be overkill. Context Providers rerender all children upon any state change (no faster paints). By saving a given store's subscriber components' references, the door is open to more customization of behavior.

## LICENSE

MIT