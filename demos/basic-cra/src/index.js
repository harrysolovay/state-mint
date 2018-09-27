import React from 'react'
import { Account, Counter, Hello } from './components'
import { render } from 'react-dom'

const App = () => (
  <div>
    <Account />
    <Counter />
    <Hello />
  </div>
)

render(<App />, document.getElementById('root'))