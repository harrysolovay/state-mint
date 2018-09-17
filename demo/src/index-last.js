import React, { Component } from 'react'
import { Store, Provider, Subscribe } from 'state-mint'
import { render } from 'react-dom'



const DEFAULT_STATE = {
  loggedIn: false,
  username: null,
}

class Auth extends Store {

  state = DEFAULT_STATE

  logIn = () =>
    this.setState({
      loggedIn: true,
      username: 'hsolvz',
    })

  logOut = () =>
    this.setState(DEFAULT_STATE)

}



class App extends Component {
  render() {
    return (
      <Provider>
        <Subscribe stores={[ Auth ]}>
          {(auth) => (
            <div>
              <button
                children={
                  auth.state.loggedIn
                    ? 'log out'
                    : 'log in'
                }
                onClick={
                  auth.state.loggedIn
                    ? auth.logOut
                    : auth.logIn
                }
              />
              <span children={
                auth.state.loggedIn
                  ? `logged in as ${auth.state.username}`
                  : 'not logged in'
              } />
            </div>
          )}
        </Subscribe>
      </Provider>
    )
  }
}



render(<App />, document.getElementById('root'))