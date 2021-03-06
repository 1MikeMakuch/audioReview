import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './Login.css'
import {Redirect} from 'react-router-dom'
import queryString from 'query-string'

var firstSubmit = true
var token

function Login(props) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [pageState, setPageState] = useState([false, false])
  const setLoggedIn = props.setLoggedIn
  const loggedIn = props.loggedIn
  const setUser = props.setUser

  if (props?.user?.name && !name) {
    setName(props.user.name)
  }
  if (props?.user?.email && !email) {
    setEmail(props.user.email)
  }

  const qs = queryString.parse(window.location.search)
  if (qs && qs.token) {
    token = qs.token

    if (!pageState || (!pageState[0] && !pageState[1])) setPageState(['token', token])
  }

  async function loginToken(token) {
    if (loggedIn) {
      return <div></div>
    } else {
      let request, response
      let url = process.env.REACT_APP_SERVER_URL + '/api/login?token=' + token
      request = {
        method: 'get',
        credentials: 'include'
      }
      try {
        response = await fetch(url, request)

        if (200 !== response?.status) {
          setPageState(['invalid', 'invalid'])
          setLoggedIn(false)
          return <div>not logged in</div>
        }
        response = await response.json()
      } catch (e) {
        console.log('login failed', e)
      }
      if (200 === response?.status) {
        setPageState(['loginResponse', response])
        if (response && response.id && response.email) {
          setUser(response)
          setLoggedIn(true)
        }
      } else {
        return <div></div>
      }
    }
    return <div></div>
  }

  function validateForm() {
    return email.length > 0
  }
  async function handleLogout(e) {
    e.preventDefault()

    let request, url

    url = process.env.REACT_APP_SERVER_URL + '/api/logout'
    request = {
      method: 'post',
      credentials: 'include'
    }

    await fetch(url, request)

    setLoggedIn(false)
    setPageState(['loggedOut', 'loggedOut'])
    setUser(null)
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
      //return <div>You are now logged in</div>

      return (
        <div style={{textAlign: 'center', fontSize: '30px'}}>
          You are logged in, please select a Tape&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      )
    } else {
      loginToken(token)
      return <div></div>
    }
  } else if (pageState && pageState[0] === 'loginResponse') {
    return showLoginResponse()
  } else if (pageState && pageState[0] === 'checkEmail') {
    return checkYourEmail()
  } else if (pageState && pageState[0] === 'loggedOut') {
    return loggedOut()
  } else if (pageState && pageState[0] === 'invalid') {
    return invalidLink()
  } else {
    return mainLogin()
  }

  function loggedOut() {
    return <Redirect to="/tape1" />
  }

  function showLoginResponse() {
    return <Redirect to="/tape1" />
  }

  function invalidLink() {
    return (
      <div>
        <div style={{textAlign: 'center', fontSize: '30px'}}>
          The login link is expired or invalid, please login again. Also you must use the same device.
        </div>
      </div>
    )
  }

  function checkYourEmail() {
    let checkEmail = pageState[1]

    let url
    if (checkEmail && 'development' === process.env.REACT_APP_ENVIRONMENT) {
      url = process.env.REACT_APP_UI_URL + '/login?token=' + checkEmail
    } else {
      url = ''
    }
    return (
      <div>
        <div style={{textAlign: 'center', fontSize: '30px'}}>Check your email for login link</div>
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
