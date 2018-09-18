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

    fromState: (state) => {
      const { loggedIn, username, bio } = state
      return { loggedIn, username, bio }
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
      bio: 'I really like StateMint!',
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