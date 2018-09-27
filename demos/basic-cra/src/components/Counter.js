import React from 'react'
import connect from '../stores'

export default connect(({ $: { counter } }) => (
  <div>
    <button
      children='-'
      onClick={ counter.decrement }
    />
    <span children={ counter.state.count } />
    <button
      children='+'
      onClick={ counter.increment }
    />
  </div>
), ['counter'])