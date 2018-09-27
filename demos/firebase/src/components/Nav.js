import React from 'react'
import mint from '../stores'

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
}) => (
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
), ['auth'])