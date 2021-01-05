import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Nav, Navbar} from 'react-bootstrap'
import './App.css'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Login from './Login'
import Tape from './Tape'

function TopNavbar(props) {
  const loggedIn = props.loggedIn
  const setLoggedIn = props.setLoggedIn
  const user = props.user

  console.log('TopNavBar', loggedIn)

  let nickname
  if (user && user.name) {
    nickname = user.name.replace(/ .*/, '')
  }
  return (
    <Router>
      <div>
        <Navbar expand="md" className="customNav" bg="primary" variant="dark" sticky="top">
          <header className="App-header">Dollahite tapes </header>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" className="container-fluid">
              <Nav.Link as={Link} to="/tape1">
                Tape 1
              </Nav.Link>
              <Nav.Link as={Link} to="/tape2">
                Tape 2
              </Nav.Link>
              <Nav.Link as={Link} to="/tape3">
                Tape 3
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="ml-auto">
                {nickname ? nickname : 'Login'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/login">
            <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
          </Route>
          <Route path="/tape1">
            <Tape tape="1" loggedIn={loggedIn} />
          </Route>
          <Route path="/tape2">
            <Tape tape="2" loggedIn={loggedIn} />
          </Route>
          <Route path="/tape3">
            <Tape tape="3" loggedIn={loggedIn} />
          </Route>
          <Route path="/">
            <div>Technical difficulties...</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
export default TopNavbar
