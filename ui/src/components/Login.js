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

  console.log('pageState 0', pageState)

  const qs = queryString.parse(window.location.search)
  if (qs && qs.token) {
    console.log('qs token', qs.token)
    token = qs.token

    if (!pageState || (!pageState[0] && !pageState[1])) setPageState(['token', token])
  }

  async function loginToken(token) {
    if (loggedIn) {
      console.log('loggedIn', token)
    } else {
      console.log('logging you in')
      //loggedIn = true
      let request, response
      let url = process.env.REACT_APP_SERVER_URL + '/api/login?token=' + token
      request = {
        method: 'get',
        credentials: 'include'
      }

      console.log('login request', request)

      response = await fetch(url, request)
      response = await response.json()
      console.log('login response', response)
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

    console.log('handleLogout', {email, name})

    let request, response, url

    url = process.env.REACT_APP_SERVER_URL + '/api/logout'
    request = {
      method: 'post',
      credentials: 'include'
    }

    console.log('logout request', request)

    let raw = await fetch(url, request)

    console.log('logout response', raw.status)
    setLoggedIn(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    console.log('handleSubmit', {email, name, firstSubmit})

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
    console.log('requestLoginLink request', request)

    let raw = await fetch(url, request)
    response = await raw.json()
    console.log('requestLoginLink response', response)
    console.log('headers', response.dev)
    let token = response?.dev['x-dollahite-tapes-app']
    setPageState(['checkEmail', token])
  }

  console.log('pageState 1', pageState)
  if (pageState && token && pageState[0] === 'token') {
    if (loggedIn) {
      return <div>You are now logged in</div>
    } else {
      loginToken(token)
      return <div>Now logging you in</div>
    }
  } else if (pageState && pageState[0] === 'loginResponse') {
    console.log('showLR')
    return showLoginResponse()
  } else if (pageState && pageState[0] === 'checkEmail') {
    return checkYourEmail()
  } else {
    return mainLogin()
  }

  function showLoginResponse() {
    return <Redirect to="/tape1" />
    //       <div>
    //         <div>Login token </div>
    //       </div>
    //    )
  }

  function checkYourEmail() {
    let checkEmail = pageState[1]
    console.log({checkEmail})
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
    console.log('Login main loggedIn', loggedIn)

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
