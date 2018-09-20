import React from 'react'
import { Account, Counter, Hello } from './components'
import mint from 'state-mint'
import stores from './stores'
import { render } from 'react-dom'

const App = mint(stores)(
  () => (
    <div>
      <Account />
      <Counter />
      <Hello />
    </div>
  )
)

render(<App />, document.getElementById('root'))