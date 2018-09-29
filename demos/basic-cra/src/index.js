import React, { Component } from 'react'
import mint from './stores'
import { Account, Counter, Hello } from './components'
import { render } from 'react-dom'

class HooBlah {

  state = { somen: 'blah' }

  hoo = () => {
    this.setState({ somen: 'hoo' })
  }

  ah = () => {
    this.setState({ somen: 'blah' })
  }

}

mint({ hooBlah: HooBlah })

const App = mint(class extends Component {
  render() {
  console.log(this.props.$)
    return (
      <div>
        <Account />
        <Counter />
        <Hello />
      </div>
    )
  }
}, ['account', 'counter', 'hello', 'hooBlah'])

render(<App />, document.getElementById('root'))