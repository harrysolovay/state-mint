import React, { Component } from 'react'
import mint from './stores'
import { Account, Counter, Hello } from './components'
import { render } from 'react-dom'

const App = mint(class extends Component {
  render() {
  // console.log('rendering container')
    return (
      <div>
        <Account />
        <Counter />
        <Hello />
      </div>
    )
  }
}, ['account', 'counter', 'hello'])

render(<App />, document.getElementById('root'))