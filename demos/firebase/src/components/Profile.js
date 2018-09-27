import React, { Fragment } from 'react'
import mint from '../stores'

export default mint(({
  $: {
    auth: {
      state: {
        loggedIn,
        avatar,
        name,
        email,
        loading,
      },
      logIn,
      logOut,
    },
  }
}) => (
  <div>
    {
      loading
        ? <div>loading profile</div>
        : <Fragment>
            {
              avatar &&
                <img
                  src={ avatar }
                  alt='user avatar'
                />
            }
            {
              name &&
                <p children={ `name: ${ name }` } />
            }
            {
              email &&
                <p children={ `email: ${ email }` } />
            }
          </Fragment>
    }
  </div>
), ['auth'])