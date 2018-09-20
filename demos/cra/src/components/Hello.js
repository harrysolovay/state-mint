import React from 'react'
import mint from 'state-mint'

const Hello = ({ stores: { hello } }) => (
  <div>
    <button
      children='next'
      onClick={ hello.next }
    />
    <span children={ hello.state.currentName } />
  </div>
)

export default mint(['hello'])(Hello)