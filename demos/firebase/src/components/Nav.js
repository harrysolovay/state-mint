import React from 'react'
import mint from 'state-mint'

export default mint(({
  $: {
    auth: {
      state: {
        loggedIn,
        loading,
      },
      logIn,
      logOut,
    }
  }
}) => {
  return (
    <div>
      {
        loading
          ? <div>loading nav bar</div>
          : <div>
              {
                loggedIn
                  ? <button
                      children='log out'
                      onClick={ logOut }
                    />
                  : <button
                      children='log in'
                      onClick={ logIn }
                    />
              }
            </div>
      }
    </div>
  )
})

// export default mint((props) => (
//   <div>
//     {
//       props.$.auth.state.loading
//         ? <div>loading nav bar</div>
//         : <div>
//             {
//               props.$.auth.state.loggedIn
//                 ? <button
//                     children='log out'
//                     onClick={ props.$.auth.logOut }
//                   />
//                 : <button
//                     children='log in'
//                     onClick={ props.$.auth.logIn }
//                   />
//             }
//           </div>
//     }
//   </div>
// ), ['auth'])