import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './Login.css'
import {Redirect, useLocation} from 'react-router-dom'
import queryString from 'query-string'

var firstSubmit = true
var token
//var loggedIn = false

function Login(props) {
  const [email, setEmail] = useState('1mikemakuch@gmail.com')
  const [name, setName] = useState('Mike M')
  const [pageState, setPageState] = useState([false, false])
  const setLoggedIn = props.setLoggedIn
  const loggedIn = props.loggedIn

  const qs = queryString.parse(window.location.search)
  if (qs && qs.token) {
    token = qs.token

    if (!pageState || (!pageState[0] && !pageState[1])) setPageState(['token', token])
  }

  async function loginToken(token) {
    if (loggedIn) {
      //console.log('loggedIn', token)
    } else {
      //loggedIn = true
      let request, response
      let url = process.env.REACT_APP_SERVER_URL + '/api/login?token=' + token
      request = {
        method: 'get',
        credentials: 'include'
      }

      response = await fetch(url, request)
      response = await response.json()

      setPageState(['loginResponse', response.data])
      setLoggedIn(true)
      //loggedIn = true
    }
  }

  function validateForm() {
    return email.length > 0
  }
  async function handleLogout(e) {
    e.preventDefault()

    let request, response, url

    url = process.env.REACT_APP_SERVER_URL + '/api/logout'
    request = {
      method: 'post',
      credentials: 'include'
    }

    let raw = await fetch(url, request)

    setLoggedIn(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    let request, response, url
    if (firstSubmit) {
      url = process.env.REACT_APP_SERVER_URL + '/api/requestLoginLink'
      request = {
        method: 'post',
        body: JSON.stringify({email, name}),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
    firstSubmit = false

    let raw = await fetch(url, request)
    response = await raw.json()

    let token = response?.dev['x-dollahite-tapes-app']
    setPageState(['checkEmail', token])
  }

  if (pageState && token && pageState[0] === 'token') {
    if (loggedIn) {
      return <div>You are now logged in</div>
    } else {
      loginToken(token)
      return <div>Now logging you in</div>
    }
  } else if (pageState && pageState[0] === 'loginResponse') {
    return showLoginResponse()
  } else if (pageState && pageState[0] === 'checkEmail') {
    return checkYourEmail()
  } else {
    return mainLogin()
  }

  function showLoginResponse() {
    return <Redirect to="/tape1" />
  }

  function checkYourEmail() {
    let checkEmail = pageState[1]

    let url
    if (checkEmail) {
      url = process.env.REACT_APP_UI_URL + '/login?token=' + checkEmail
    } else {
      url = 'n/a'
    }
    return (
      <div>
        <div>Check your email</div>
        <a href={url}>{url}</a>
      </div>
    )
  }

  function mainLogin() {
    let description = '',
      buttonAction,
      disabled = false

    let submitHandler

    if (loggedIn) {
      description = "You're logged in"
      disabled = true
      submitHandler = handleLogout
      buttonAction = 'Logout?'
    } else {
      description = (
        <div>
          Please submit your name and email to be emailed a login link.
          <p />
          No password required.
        </div>
      )
      buttonAction = 'Login'
      submitHandler = handleSubmit
    }
    return (
      <div className="Login">
        <Form disabled={disabled} onSubmit={submitHandler}>
          <Form.Group size="lg" controlId="email">
            <Form.Label>{description}</Form.Label>

            <Form.Control
              disabled={disabled}
              autoFocus
              type="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
            />

            <Form.Control
              disabled={disabled}
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
            />
          </Form.Group>

          <Button block size="lg" type="submit" disabled={!loggedIn && (!validateForm() || disabled)}>
            {buttonAction}
          </Button>
        </Form>
      </div>
    )
  }
}
export default Login
