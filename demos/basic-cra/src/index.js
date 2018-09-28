import React from 'react'
import mint from './stores'
import { Account, Counter, Hello } from './components'
import { render } from 'react-dom'

const App = mint(() => {
  // console.log('rendering container')
  return (
    <div>
      <Account />
      <Counter />
      <Hello />
    </div>
  )
}, ['account', 'counter', 'hello'])

render(<App />, document.getElementById('root'))