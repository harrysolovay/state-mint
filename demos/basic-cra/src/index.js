import React, { Component } from 'react'
import { Account, Counter, Hello } from './components'
import { render } from 'react-dom'

class App extends Component {
  render() {
    return (
      <div>
        <Account />
        <Counter />
        <Hello />
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))