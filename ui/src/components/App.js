import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Nav, Navbar, Card} from 'react-bootstrap'
//import {Container, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'
import './App.css'
import React, {useState} from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import MP3 from './MP3'
import tapes from '../constants'
import TopNavbar from './TopNavbar'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  isLoggedIn()
  return <TopNavbar user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

  async function isLoggedIn() {
    let response,
      request = {
        method: 'get',
        credentials: 'include'
      }
    let url = process.env.REACT_APP_SERVER_URL + '/api/isLoggedIn'

    try {
      response = await fetch(url, request)
      response = await response.json()
    } catch (e) {}

    if (response?.id && response.email) {
      if (!loggedIn) setLoggedIn(true)
      if (!user) setUser(response)
    } else {
      if (loggedIn) setLoggedIn(false)
      if (user) setUser(null)
    }
  }
}
export default App
