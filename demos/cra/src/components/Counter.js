import React from 'react'
import mint from 'state-mint'

const Counter = ({ stores: { counter } }) => (
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

export default mint(['counter'])(Counter)