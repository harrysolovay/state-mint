import React from 'react'
import connect from '../stores'

const Counter = ({ $: { counter } }) => {
  // console.log('rendering counter')
  return (
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
}

Counter.lifeCycle = ({ $ }) => ({

  componentDidMount() {
    console.log('component mounted', $)
  },

})

export default connect(Counter, ['counter'])