import React from 'react'
import connect from '../stores'

export default connect(({ $: { account } }) => (
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
    <div>
      <button
        children='out-of-state toggle'
        onClick={ account.statelessToggle }
      />
      <span
        children={
          account.someVar
            ? 'false'
            : 'true'
        }
      />
    </div>
  </div>
), ['account'])