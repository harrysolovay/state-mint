import { auth } from 'firebase'

const DEFAULT_STATE = {
  loggedIn: false,
  name: null,
  email: null,
  avatar: null,
  loading: true,
}

export default class Account {

  state = { ...DEFAULT_STATE }

  persistence = true

  logIn = async () => {
    this.setState({ loading: true })
    const facebookAuthProvider = new auth.FacebookAuthProvider()
    try {
      await auth().signInWithPopup(facebookAuthProvider)
    } catch(error) {
      console.error('log in error', error)
    }
  }

  logOut = async () => {
    this.setState({ loading: true })
    try {
      await auth().signOut()
    } catch(error) {
      console.error('log out error', error)
    }
  }

  registerAuthListener = () => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          loading: false,
        })
      } else {
        this.setState({
          ...DEFAULT_STATE,
          loading: false,
        })
      }
    })
  }

}