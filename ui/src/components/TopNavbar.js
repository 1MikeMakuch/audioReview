import 'bootstrap/dist/css/bootstrap.min.css'
import {Nav, Navbar} from 'react-bootstrap'
//import {Container, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'
import './App.css'
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'

import {useState} from 'react'

import Login from './Login'
import Tape from './Tape'

function TopNavbar() {
  return (
    <Router>
      <div>
        <Navbar expand="md" className="customNav" bg="primary" variant="dark" sticky="top">
          <header className="App-header">Dollahite tapes </header>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={Link} to="/tape1">
                Tape 1
              </Nav.Link>
              <Nav.Link as={Link} to="/tape2">
                Tape 2
              </Nav.Link>
              <Nav.Link as={Link} to="/tape3">
                Tape 3
              </Nav.Link>
              <Nav.Link as={Link} to="/login">
                Loginx
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/tape1">
            <Tape tape="1" />
          </Route>
          <Route path="/tape2">
            <Tape tape="2" />
          </Route>
          <Route path="/tape3">
            <Tape tape="3" />
          </Route>
          <Route path="/">
            <div>xyzzy</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}
export default TopNavbar
