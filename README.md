<div align="center">
<h1>State Mint 🌿</h1>
</div>


<!--<h1 align='center'>
  <img src='logo.png' alt='State Mint' />
</h1>-->


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
  <img src='http://img.badgesize.io/https://unpkg.com/state-mint@0.1.3/lib/state-mint.min.js?compression=gzip&label=gzip%20size&style=flat-square' />
</a>

</p>

<hr />

> **A state layer that keeps your React project fresh 🌿**
> Designed for React developers, State Mint is a boilerplate-free state management and persistence solution with spectacular performance and developer experience.

<details>
<summary>view minimal example implementation</summary>

```jsx
import React from 'react'
import mint from 'state-mint'
import { render } from 'react-dom'

// define the store as an ES6 class:
class ModalStore {
  
  state = { showingModal: false }
    
  toggleModal = () =>
    this.setState({
      showingModal: !this.state.showingModal,
    })
    
}

// 'mint' the store:
mint({ modal: ModalStore })

// 'mint' the component that uses 'modal' data:
const Modal = mint((props) => {
  const showingModal = props.$.modal.state.showingModal
  const toggleModal = props.$.modal.toggleModal
  return (
    <div>
      { showingModal && <div>modal contents</div> }
      <button onClick={ toggleModal }>
      	{ showingModal ? 'hide' : 'show' }
      </button>
    </div>
  )
})

// ^ because the component references the 'modal' store,
// changes to the modal store's state will trigger a rerender

render(<ConnectedModal />, document.getElementById('root'))
```

</details>

## Highlights
- 🤯 use all features without visibly touching more than a single, one-parameter function from this library

- 🧛‍♂️ highly configurable data persistence with [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) and/or [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie) on web, and [async storage](https://facebook.github.io/react-native/docs/asyncstorage) and/or [secure store](https://docs.expo.io/versions/latest/sdk/securestore) on React Native

- 👂 subscription inference: components are intelligently subscribed to listen for changes in the stores they reference (or, you can specify subscriptions the old-fashioned way)

- 🎯 stores can directly access oneanother (easy to induce side-effects)

- 🎩 store instances can be initialized and connected to components asynchronously • new stores will (with zero extra configuration) collect subscriptions from previously-initialized components that reference the new store

- 😷 keep your state safe from direct mutation with a re-implemented, data-persisting `setState`, which can be used identically to React's Component setState

- 🎣 add lifecycle hooks to functional components with no additional HOC

  **other things that're good to have...**

- 👩‍👧‍👦 no dependencies

- 📦 under 3kbs gzipped

- 🍻 plays nice with older versions React

- 🔐 *(give me until October 4th)* Flow & TypeScript typings

## Guide

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Quick Start](#quick-start)
- [Why?](#why)
- [Overview](#overview)
- [Minting](#minting)
- [Subscriptions](#subscriptions)
- [Persistence](#persistence)
- [Lifecycle hooks](#lifecycle-hooks)
- [FAQ](#faq)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

### availability

#### [NPM Registry](https://www.npmjs.com/package/state-mint)

```sh
npm i state-mint
```

#### [unpkg](https://unpkg.com/state-mint)

```html
<!-- loads minified UMD build -->
<script src='https://unpkg.com/state-mint'></script>
```

### build formats

#### ES Module

```js
import mint from 'state-mint'
```

#### CommonJS

```diff
- const mint = require('state-mint')
+ const mint = require('state-mint').default
```

#### UMD

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

// 'mint' takes in an object with keyed store classes
mint({ counter: Counter })

// use 'mint' again to wrap a component that uses the 'counter' store
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

To use the `counter` store above in other modules, import `mint` again and wrap the component that needs access:

`some-other-file.js`

```jsx
import mint from 'state-mint'

const AnotherCounterComponent = mint((props) => {
  const { $: { counter: { state: { count } } } }
  return <div>{ count }</div>
})

// ^ that's it
```

## Why?

### the ideal

State management and persistence shouldn't require the learning of new conventions and repetitive persistence implementations; React developers are familiar with [HOCs (higher-order components)](https://reactjs.org/docs/higher-order-components.html) and [`setState`](https://reactjs.org/docs/react-component.html#setstate). State management libraries should allow implementations to involve as little library code as possible, and allow users to focus on defining their data and actions, without excessive boilerplate or 3rd-party plugins and middleware.

### the reality

Opinionated state management often simplifies debugging and collaboration. Once a project reaches ~5,000 lines, chances are that you're thinking about how to enforce rules for consistency and maintainability. However, you might want to tackle this problem in a way more suited to your project needs and coding style. A lot of the time, this will differ from de facto approaches.

### the history

Before React came onto the scene, global state management was, for many projects, somewhat of an afterthought. For simple websites, one might hastily throw global state into the window object. Nowadays, for the sake of enabling smoother application evolution, state management needs to eliminate the possibility of overwrites––usually through careful scoping or synthetic immutability ("synthetic" because JavaScript is not a functional programming language). State management also needs to be 'binding' or 'reactive' (kept in sync with the user interface). Tools that take a functional approach to state management can simplify otherwise complex data pipelines, and make it possible to use back-tracking middleware (not to mention keep you safe from stack trace hell). This is a big part of Redux's success. However, the look of Redux and other common solutions can be horrific.

### the horror

***[Redux](https://github.com/reduxjs/redux) :*** Conventional Redux requires that you separate action types from their logic, logic from its data, and data from its triggering of subsequent actions. Depending on how you like to work, this decoupling is either the best or the worst approach (if you lay in the middle, chances are [you might not need Redux](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) – written by the creator himself).

***[MobX](https://github.com/mobxjs/mobx):*** comes in a few different flavors. Classic MobX is a step in a more intuitive and object-oriented direction. On the downside, it forces users to specify which store members are observable, which is a new convention (in React, by default, a Component instance's state member is observable, and using setState will trigger a rerender that uses the new state). This being said, the new convention does lead to a performance gain by haulting unnecessary rerenders in your DOM tree. One pitfall is that MobX encourages explicit mutation of observable data, which is a React anti-pattern.

***[MobX State Tree](https://github.com/mobxjs/mobx-state-tree)*** has the best of both mutability and immutability (reactive variable assignment, back-tracking & snapshot debugging). It let's you nest store data in a way that scales, and your models always stay in sync... but it has the age-old pitfall of too-many opinions. Its specific opinions might resonate with you, although there's definitely a learning curve. However, it doesn't follow suit with React as a platform that enourages heuristics.

***[Apollo Link State](https://github.com/apollographql/apollo-link-state):*** If your app interfaces with a GraphQL server, this could be a good solution. The Apollo ecosystem is vibrant and rapidly-growing. Apollo Link State gives users a strong API for syncing fetched data in memory and offline persistence. However, it's also very opinionated, and unless you're already using Apollo Client, it probably isn't the best solution.

***[Unstated](https://unstated.io):*** as far as alternatives go, Unstated is the least opinionated with the lowest learning curve. The underlaying mechanism is pretty cool: behind the scenes, stores are initialized inside a React Context Consumer, which then passes the store data to its parent provider, which then passes the data to all store Consumers. This pattern is very creative (deconstructing it was a fun puzzle), but it is a little hackey, and results in extra operations with each update. It also means you need to use the Store contructor as a key to the instance (an extra import and a lack of support for multiple instances of the same store). Another disadvantage is that (without a custom HOC) data can only be accessed within a render method (aka. can't use stores in lifecycle methods).

### enter State Mint

State Mint allows developers to establish fully-featured, complex, data flows with as little library code as possible. A value of heuristics, simplicity and flexibility are at the core of its design. Its usage involves a single function that both initializes stores and connects components to the stores they reference. It's hard to emphasize enough that **this is the cleanest state management developer experience**, hands-down.

## Overview

1. Define your stores as ES6 classes and use `state` and `setState` just as you would when extending React.Component. For all intensive purposes, there's no difference in their usage.

2. Import the `mint` function from the `state-mint` package, and call it with an object that has your Store class constructors as the values (key them however you'd like to later reference the instance).

3. Use the `mint` function again to wrap your components, thereby subscribing them to the stores they reference.

> by all means switch up steps 2 and 3

## Minting

### the thinking behind the term

The name was selected as it relates to the idea of an industrial facility that manufactures coins
> "Mint: a place where money is coined, especially under state authority" (dictionary.com)

While it is a nice play on words (especially relating to `setState`), the term "mint" also suggests something to the effect of governing (digital) assets. All-in-all, I believe it's a good fit for this library, and could be adopted by others as a term for describing the instanciation of data stores.

### minting stores

Stores are defined as ES6 classes, and then "minted" with the default-exported function of the `state-mint` package. By passing your stores to that `mint` function, the stores get extended with the `setState` method, along with performance enhancements, (if configured) persistence features, subscriber controls and more. The extended class is then instanciated and placed appropriately within a scope that can only be accessed by a minted component. This prevents accidental overwrites and other conflicts.

```js
import mint from 'state-mint'

class MyStore {
  state = { whosStore: 'mine' }
}

// this mints one instance, with a key of 'my'
mint({ my: MyStore })
```

### minting components

You can connect any component to store(s) data by simply wrapping the component in the same `mint` function as before. In minting a component, State Mint will inspect which stores the component (including lifecycle methods) reference. This feature is called 'subscription inference.' When a given store's state is updated, its subscribed components are rerendered.

```js
import mint from 'state-mint'

const Whos = mint((props) => {
  const { $: { my } } = props
  return (
    <div>
      <span>{ my.state.whosStore }</span>
    </div>
  )
})
```

### switching up the order

Subscription inference will work, even if you define a store after instanciating a component that uses the store's data. A simple `if (props.$.storeName)` in your component will safeguard against errors that come about from the store being undefined. Once the store is defined, the component will be subscribed to it, and will rerender with the store data. In other words, you don't need to mint any stores in order to mint a component.

```js
import mint from 'state-mint'

const Whos = mint((props) => {
  const storeOrNull = props.$.my
  return (
    <div>
      {
        storeOrNull &&
          <span>{ storeOrNull.state.whosStore }</span>
      }
    </div>
  )
})

class MyStore = {
  state = { whosStore: 'mine' }
}

mint({ my: MyStore })
```

## Subscriptions

There are two ways to subscribe (connect) components with State Mint. In either case, subscribing a component to a store will do two things: (1) it will make the store's data accessible through props with a key of `$` (`props.$`) and (2) it will rerender the component upon any changes to the state of stores to which the component is subscribed.

### manual assignment

The first way to subscribe a component to a store is to mint the store with a second argument, an array of store keys. For instance:

```js
import mint from 'state-mint'

const Header = mint((props) => (
  <header>
    <span>{ props.$.storeKey.state.headerText }</span>
  </header>
), ['header'])
```

### subscription inference

In the vast majority of use cases, subscription inference will work equally-well. The underlaying operations involve converting your component and any lifecycle methods or hooks to strings, and and then parsing out whether a given store is referenced.

```js
import mint from 'state-mint'

const Header = mint((props) => (
  <header>
    <span>{ props.$.storeKey.state.headerText }</span>
  </header>
))
```

Don't worry about the effects of destructuring or other syntactical abstractions of the reference:

```js
import mint from 'state-mint'

const Header = mint(({
  $: {
    storeKey: {
      state: {
        headerText,
      }
    }
  }
}) => (
  <header>
    <span>{ headerText }</span>
  </header>
))
```

### managing an instance's subscription

Let's say you want to subscribe or unsubscribe a component that's already been instanciated:

```js
import mint from 'state-mint'

const Countdown = mint((props) => {
  const secondsTillKeynote = props.$.countdown.state.count
  if (secondsTillKeynote <= 0) {
    props.$.unsubscribe()
    // or specify unsubscription to avoid unsubscribing from other stores:
    // props.$.unsubscribe(['countdown'])
  }
  return <span>{ secondsTillKeynote } seconds</span>
})
```

## Persistence

Configure persistence by setting the 'persistence' instance variable within your store class. Different stores can use different strategies. However, you can only use one strategy per-store.

### options

**strategy:** the storage provider you wish to use –– available strategies are...

* [session storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
* [local storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
* [async storage](https://facebook.github.io/react-native/docs/asyncstorage)
* [secure store](https://docs.expo.io/versions/latest/sdk/securestore)

> defaults to `window.localStorage` in web and `null` in React Native

**fromStore:** function that collects data into and returns the object you wish to persist; gathers data from memory whenever persistent save is triggered

> defaults to null

**toStore:** function used upon initialization to hydrate store with persisted data (takes in a single argument: the persisted object returned from fromStore); toStore should re-set state and re-assign instance variables based on the persisted data

> defaults to null

**options:** usage of this property depends on how you want the given persistence strategy to behave (strategy-specific). To use the `document.cookie` strategy with a one-week expiration, set `persistence.options` to `{ days: 7 }`

> defaults to null

### auto-config

By default, persistence is disabled. To enable persistence without configuration, simply set the `persist` instance variable to `true`. Every time the state changes, it will be persisted with localStorage (must set strategy in React Native).

```diff
export default class Counter {

  state = { count: 0 }
  
+ persistence = true

  increment = () =>
    this.setState({
    	count: this.state.count + 1,
    })

  decrement = () =>
    this.setState({
    	count: this.state.count - 1,
    })

}
```

### setting to a non-default strategy

To use another persistence strategy, set persistence to an object containing a `strategy` prop. Assign to it the strategy you wish to use.

```diff
export default class Counter {

  state = { count: 0 }
  
+ persistence = { strategy: window.sessionStorage }

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

### React Native

To use AsyncStorage or SecureStore (React Native only), you'll need to first import the storage provider:

```diff
+ import { AsyncStorage } from 'react-native'

export default class Counter {

  state = { count: 0 }
  
+ persistence = { strategy: AsyncStorage }

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

### specify what data to persist

We don't always want to persist the entire state, and sometimes we want to persist data outside of state (instance variables). Be careful though, persisting functions will result in an error (as they cannot be converted to JSON).

In this particular case, we want to persist info about the user, but we don't want to persist whether or not to show the bio.

```diff
const DEFAULT_STATE = {
  loggedIn: false,
  username: null,
  bio: null,
  bioShowing: false,
}

export default class Account {

  state = { ...DEFAULT_STATE }

  persistence = {

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

### manually trigger a persistent save

Often times, you'll want to persist your data independent of state, or application memory for that matter. By defining fromStore & toStore, you can establish the flow of data in and out of persistent storage. From this flow, State Mint checks to see if persistent storage references state at all. If it does, then calling setState will trigger a persistent save. Otherwise, setState will leave persistent storage untouched. Aka., you can stop using setState if the only class features you're using are instance variables and persistence; manually trigger a persistent save by calling `this.persist` with no arguments from within your store class. It won't trigger a re-render, but it will save the data to your chosen or the default strategy.

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

## Lifecycle hooks

State Mint makes use of the [higher-order component (HOC) pattern](https://reactjs.org/docs/higher-order-components.html) for which the React team advocates. Because of the use of stateful HOCs, there's little reason to define your wrapped component as also stateful. Instead, boost performance by using minted stores (instead of local state) and adding lifecycle hooks as a static property of your (newly) functional component.

```jsx
import mint from 'state-mint'

const Counter = ({ $: { counter } }) => (
  <div>
    <button
      children='-'
      onClick={ counter.decrement }
    />
    <span children={ counter.state.count } />
    <button
      children='+'
      onClick={ counter.increment }
    />
  </div>
)

Counter.lifeCycleHooks = ({ $ }) => ({

  constructor() {
    console.log('constructing', $)
  },

  componentDidMount() {
    console.log('component mounted', $)
  },

})

export default mint(Counter)
```
<br />

<details>
<summary>architectural sidenote</summary>
For the time being, using HOCs seems to be the safest way to compose user-defined components with a library-defined component (consumer-specific settings and rerender trigger). However, in my experimentation, I did find another pattern which performs better for the creation of store-consuming components: the component "minter" could extend a new class with the user-defined component (which extends React.Component). Inside of this newly-generated class, ES6 symbols would be used to mask private properties of the wrapper. This way, there's no overriding of props. Although I see no pitfalls, this is advised against. That advisement most likely has to do with the fact that synthetic inheritence shards a few levels deep. Best not to confuse JavaScript with fully-object-oriented languages.
</details>

Now, when you use the Counter component, the constructor and componentDidMount hooks will be triggered from the stateful component in which it is contained.

### Provide

Although left unhighlighted for the sake of simplicity, the `state-mint` package does have a named export `provide`, which allows you to create a new `minter` (new stores scope). It's useful to think about this using classical state management terms such as provider and consumer. Until this point in the documentation, the line between provider and consumer is blurry; the default-exported function has been used both to initialize stores and to connect components to those stores. This is incredibly useful in lowering the learning curve, but it doesn't result in awareness of a more advanced and potentially (depending on your project) deliberate pattern: instead of importing the default export (a pre-initialized provider), import the named export `provide`, which allows you to initialize your own providers:

`~/src/stores/index.js`

```js
import { provide } from 'state-mint'

import Auth from './Auth'
import Feed from './Feed'
import Cart from './Cart'
import Analytics from './Analytics'

export default provide({
  auth: Auth,
  feed: Feed,
  cart: Cart,
  analytics: Analytics,
})
```
> note: you can initialize a provider with no stores

Now, instead of importing `mint` from the `state-mint` package, import `mint` from where you defined your provider.

`~/src/components/cart.js`

```diff
- import mint from 'state-mint'
+ import mint from '~/src/stores'

export default mint(({ $: { cart } }) => {

  const { items } = cart.state
  	
  return (
    <div>
      {
        items.map((item) => (
          <div className='cart-item'>
            <img src={ item.thumbnail } />
            <h3>{ item.name }</h3>
            <p>{ item.description }</p>
            <h5>{ item.price }</h5>
          </div>
        ))
      }
    </div>
  )
  
})
```

Some projects are large and unweildy, any can make use of multiple providers as a way of further scoping (and stabilizing) their data flows. Let's break the example above into two providers:

`~/src/stores/index.js`

```js
import { provide } from 'state-mint'

import Auth from './Auth'
import Feed from './Feed'

import Cart from './Cart'
import Analytics from './Analytics'

export const authAndFeedMint = provide({
  auth: Auth,
  feed: Feed,
})

export const cartAndAnalyticsMint = mint({
  cart: Cart,
  analytics: Analytics,
})
```

## Future direction


## FAQ

**Q)** How can I use `setState` in my store without extending another class where `setState` is defined?<br />
**A)** Before `mint` constructors your store, the `setState` method is attached to the class prototype (precompiled, it defines a new class that extends yours). Although your class doesn't have a setState method upon its initial definition, it will upon runtime.

**Q)** Why doesn't it use React's Context API?<br />
**A)** While React@^16.3 Context can be [polyfilled](https://github.com/jamiebuilds/create-react-context) for older versions of react, I wanted State Mint to work without the React version or polyfill package dependency. Plus, using React Context would be overkill; Context Providers rerender all children upon any state change, which leads to a lot of unecessary rerendering. By saving a given store's subscriber components' references, the door is open to more customization of behavior.

## LICENSE

MIT