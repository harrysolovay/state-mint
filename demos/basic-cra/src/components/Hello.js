import React from 'react'
import connect from '../stores'

const Hello = ({ $: { hello } }) => (
  <div>
    <button
      children='next'
      onClick={ hello.next }
    />
    <span children={ hello.state.currentName } />
  </div>
)

export default connect(Hello, ['hello'])