import React, { Component } from 'react'
import { initializeApp } from 'firebase'
import mint from './stores'
import { Nav, Profile } from './components'
import { render } from 'react-dom'

initializeApp({
  apiKey: 'AIzaSyADC0sbwYVTaYj1lxy4r4MC0OS-b12k42g',
  authDomain: 'state-mint-api-demo.firebaseapp.com',
  databaseURL: 'https://state-mint-api-demo.firebaseio.com',
  projectId: 'state-mint-api-demo',
  storageBucket: 'state-mint-api-demo.appspot.com',
  messagingSenderId: '166771682305',
})

const App = mint(class extends Component {

  render() {
    console.log('rendering container')
    return (
      <div>
        <Nav />
        <Profile />
      </div>
    )
  }

  // constructor() {
  //   super()
  //   console.log('constructing')
  // }

  // componentWillMount() {
  //   console.log('component will mount')
  // }

  componentDidMount() {
    this.props.$.auth.registerAuthListener()
  }

  // componentWillReceiveProps() {
  //   console.log('component will receive props')
  // }

  // componentWillUpdate() {
  //   console.log('component will update')
  // }

  componentDidUpdate() {
    console.log('component did update')
  }

  // componentWillUnmount() {
  //   console.log('component will unmount')
  // }

}, ['auth'])


render(<App />, document.getElementById('root'));