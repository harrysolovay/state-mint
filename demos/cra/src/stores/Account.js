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
    
    fromState: (state) => {
      const { bioShowing, ...user } = state
      return user
    },

    toState: (persistedData) => ({
      ...DEFAULT_STATE,
      ...persistedData,
    }),

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