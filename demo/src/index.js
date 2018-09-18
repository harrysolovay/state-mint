import React from 'react'
import { Account, Counter } from './components'
import mint from 'state-mint'
import stores from './stores'
import { render } from 'react-dom'

const App = mint(stores)(() => (
  <div>
    <Account />
    <Counter />
  </div>
))

render(<App />, document.getElementById('root'))