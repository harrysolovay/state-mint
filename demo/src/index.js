import React from 'react'
import connect from 'state-mint'
import { render } from 'react-dom'


const AUTH_DEFAULT_STATE = {
  loggedIn: false,
  username: null,
}

class Auth {

  state = AUTH_DEFAULT_STATE

  persist = [ localStorage ]

  logIn = () => {
    this.setState({
      loggedIn: true,
      username: 'hsolvz',
    })
  }

  logOut = () => {
    this.setState(AUTH_DEFAULT_STATE)
  }

}

const COUNTER_DEFAULT_STATE = {
  count: 0,
}

class Counter {

  state = COUNTER_DEFAULT_STATE

  persist = [ localStorage ]

  increment = () => {
    this.setState((lastState) => ({
      count: lastState.count += 1
    }))
  }

  decrement = () => {
    this.setState((lastState) => ({
      count: lastState.count -= 1
    }))
  }

}



const Nav = connect(['auth'])(({
  stores: {
    auth
  }
}) => {
  return (
    <div>
      <button
        children={
          auth.state.loggedIn
            ? 'log out'
            : 'log in'
        }
        onClick={
          auth.state.loggedIn
            ? auth.logOut
            : auth.logIn
        }
      />
      <span
        children={
          auth.state.loggedIn
            ? `logged in as ${ auth.state.username }`
            : 'not logged in'
        }
      />
    </div>
  )
})

const TheCounter = connect(['counter'])(({
  stores: {
    counter
  }
}) => {
  return (
    <div>
      <button
        children='-'
        onClick={ counter.decrement }
      />
      <span
        children={ counter.state.count }
      />
      <button
        children='+'
        onClick={ counter.increment }
      />
    </div>
  )
})


const AnotherCounterComponent = connect(['counter'])(({
  stores: {
    counter
  }
}) => (
  <div>
    <button
      children='-'
      onClick={ counter.decrement }
    />
    <span
      children={ counter.state.count }
    />
    <button
      children='+'
      onClick={ counter.increment }
    />
  </div>
))


const App = connect({
  auth: Auth,
  counter: Counter,
})(() => (
  <div>
    <Nav />
    <TheCounter />
    <AnotherCounterComponent />
  </div>
))



render(<App />, document.getElementById('root'))