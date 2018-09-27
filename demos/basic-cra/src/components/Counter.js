import React from 'react'
import connect from '../stores'

const Counter = ({ $: { counter } }) => (
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
)

export default connect(Counter, ['counter'])