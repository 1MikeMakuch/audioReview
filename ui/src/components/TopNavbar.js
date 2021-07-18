import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Nav, Navbar} from 'react-bootstrap'
import './App.css'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Login from './Login'
import Tape from './Tape'
import _ from 'lodash'

function TopNavbar(props) {
  const [users, setUsers] = useState({})
  const loggedIn = props.loggedIn
  const setLoggedIn = props.setLoggedIn
  const user = props.user
  const setUser = props.setUser

  let nickname
  if (user && user.name) {
    nickname = user.name.replace(/ .*/, '')
    user.nickname = nickname
  }

  useEffect(() => {
    getUsers().then(users => {
      setUsers(users)
    })
  }, [])

  //  if (0 === Object.keys(users).length) getUsers()

  const tape = _.get(window.location.href.split(/\//), '3')

  return (
    <Router>
      <div>
        <Navbar expand="md" className="customNav" bg="primary" variant="dark" sticky="top">
          <header className="App-header">Vics tapes </header>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto container-fluid">
              <Nav.Link as={Link} to="/tape1">
                Tape 1
              </Nav.Link>
              <Nav.Link as={Link} to="/tape2">
                Tape 2
              </Nav.Link>
              <Nav.Link as={Link} to="/tape3">
                Tape 3
              </Nav.Link>
              <Nav.Link as={Link} to="/tape4">
                Tape 4
              </Nav.Link>
              <Nav.Link as={Link} to="/tape5">
                Tape 5
              </Nav.Link>
              <Nav.Link as={Link} to="/tape6">
                Tape 6
              </Nav.Link>
              <Nav.Link as={Link} to="/tape7">
                Tape 7
              </Nav.Link>
              <Nav.Link as={Link} to="/tape8">
                Tape 8
              </Nav.Link>
              <Nav.Link as={Link} to="/tape9">
                Tape 9
              </Nav.Link>
              <Nav.Link as={Link} to="/tape10">
                Tape 10
              </Nav.Link>
              <Nav.Link as={Link} to="/login" className="ml-auto">
                {nickname ? nickname : <div style={{color: '#ffffff', bold: true}}>Login</div>}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path="/login">
            <Login setLoggedIn={setLoggedIn} loggedIn={loggedIn} setUser={setUser} />
          </Route>
          <Route path="/tape1">
            <Tape tape="1" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape2">
            <Tape tape="2" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape3">
            <Tape tape="3" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape4">
            <Tape tape="4" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape5">
            <Tape tape="5" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape6">
            <Tape tape="6" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape7">
            <Tape tape="7" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape8">
            <Tape tape="8" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape9">
            <Tape tape="9" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/tape10">
            <Tape tape="10" loggedIn={loggedIn} users={users} user={user} />
          </Route>
          <Route path="/">
            <div>Technical difficulties...</div>
          </Route>
        </Switch>
      </div>
    </Router>
  )

  async function getUsers() {
    let request, url

    url = process.env.REACT_APP_SERVER_URL + '/api/users'
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)

    let usersList = await raw.json()
    let usersObj = {}
    usersList.map(user => (usersObj[user.id] = user))
    return usersObj
  }
}
export default TopNavbar
