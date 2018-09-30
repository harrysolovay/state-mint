import React from 'react'
import mint from 'state-mint'

export default mint(({ $: { hello } }) => {
  // console.log('rendering account')
  return (
    <div>
      <button
        children='next'
        onClick={ hello.next }
      />
      <span children={ hello.state.currentName } />
    </div>
  )
}, ['hello'])