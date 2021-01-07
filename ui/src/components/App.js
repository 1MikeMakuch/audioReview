import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useEffect, useState} from 'react'
import TopNavbar from './TopNavbar'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    isLoggedIn().then(data => {
      if (data && data.id && data.email) {
        setUser(data)
        setLoggedIn(true)
      }
    })
  }, [])

  return <TopNavbar user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser} />

  async function isLoggedIn() {
    let response = false,
      request = {
        method: 'get',
        credentials: 'include'
      }
    let url = process.env.REACT_APP_SERVER_URL + '/api/isLoggedIn'

    try {
      response = await fetch(url, request)
      response = await response.json()
    } catch (e) {
      return false
    }

    return response
  }
}
export default App
