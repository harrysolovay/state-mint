import React from 'react'
import mint from 'state-mint'

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

// Counter.lifeCycleHooks = ({ $ }) => ({

//   constructor() {
//     console.log('constructing', $)
//   },

//   componentDidMount() {
//     console.log('component mounted', $)
//   },

// })

export default mint(Counter)