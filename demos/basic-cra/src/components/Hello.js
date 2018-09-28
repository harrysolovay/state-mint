import React from 'react'
import connect from '../stores'

export default connect(({ $: { hello } }) => {
  // console.log('rendering hello')
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