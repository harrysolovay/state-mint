import React from 'react'
import mint from 'state-mint'

const Account = ({ stores: { account } }) => (
  <div>
    <button
      children={
        account.state.loggedIn
          ? 'log out'
          : 'log in'
      }
      onClick={
        account.state.loggedIn
          ? account.logOut
          : account.logIn
      }
    />
    <span
      children={
        account.state.loggedIn
          ? `logged in as ${ account.state.username }`
          : 'not logged in'
      }
    />
    { 
      account.state.loggedIn &&
        <div>
          {
            account.state.bioShowing &&
              <div>
                <h3 children='bio' />
                <p children={ account.state.bio } />
              </div>
          }
          <button
            children={
              account.state.bioShowing
                ? 'hide bio'
                : 'show bio'
            }
            onClick={ account.toggleBioShowing }
          />
        </div>
    }
  </div>
)

export default mint(['account'])(Account)