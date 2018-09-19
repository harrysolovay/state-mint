const DEFAULT_STATE = {
  loggedIn: false,
  username: null,
  bio: null,
  bioShowing: false,
}

export default class Account {

  state = DEFAULT_STATE

  persistence = {

    strategy: window.localStorage,

    // make so you don't need to pass state
    // check if mounted in setState
    
    fromStore: (state) => {
      const { bioShowing, ...user } = this.state
      return user
    },

    toStore: (persistedData) => {
      this.setState((lastState) => ({
        ...lastState,
        ...persistedData,
      }))
    },

  }

  logIn = () => {
    this.setState((lastState) => ({
      ...lastState,
      loggedIn: true,
      username: 'hsolvz',
      bio: 'I really like State Mint!',
    }))
  }

  toggleBioShowing = () => {
    this.setState((lastState) => ({
      ...lastState,
      bioShowing: !lastState.bioShowing,
    }))
  }

  logOut = () => {
    this.setState(DEFAULT_STATE)
  }

}