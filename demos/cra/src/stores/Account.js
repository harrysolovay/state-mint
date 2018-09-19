const DEFAULT_STATE = {
  loggedIn: false,
  username: null,
  bio: null,
  bioShowing: false,
}

export default class Account {

  state = { ...DEFAULT_STATE }

  someVar = false

  persist = {

    strategy: window.localStorage,

    fromStore: () => {
      const { someVar } = this
      const { bioShowing, ...user } = this.state
      return { someVar, ...user }
    },

    toStore: (persistedData) => {
      const { someVar, ...user } = persistedData
      this.someVar = someVar
      this.setState((lastState) => ({
        ...lastState,
        ...user,
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

  statelessToggle = () => {
    this.someVar = !this.someVar
    this.persist()
  }

}