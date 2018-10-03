import React from 'react'
import mint from 'state-mint'

// export default mint(({ $: { hello } }) => {
//   return (
//     <div>
//       <button
//         children='next'
//         onClick={ hello.next }
//       />
//       <span children={ hello.state.currentName } />
//     </div>
//   )
// })

// async:
export default mint((props) => {
  const { $ } = props
  if ($) {
    var { hello } = $
  }
  return (
    <div>
      <button
        children='next'
        onClick={
          hello
            ? hello.next
            : () => {}
        }
      />
      { hello && <span children={ hello.state.currentName } /> }
    </div>
  )
})