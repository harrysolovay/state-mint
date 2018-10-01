import React from 'react'
import { initializeApp } from 'firebase'
import './stores'
import mint from 'state-mint'
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

const App = () => (
  <div>
    <Nav />
    <Profile />
  </div>
)

App.lifeCycleHooks = ({ $ }) => ({

  constructor() {
    console.log('constructor')
  },

  componentDidMount() {
    $.auth.registerAuthListener()
    console.log('component did mount')
  },

  componentDidUpdate() {
    console.log('component did update')
  },

  componentWillUnmount() {
    console.log('component will unmount')
  },

})

const MintedApp = mint(App, ['auth'])


render(<MintedApp />, document.getElementById('root'));