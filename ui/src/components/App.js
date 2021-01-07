import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import React, {useEffect, useState} from 'react'
import TopNavbar from './TopNavbar'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  console.log('App', {user, loggedIn})
  useEffect(() => {
    isLoggedIn().then(data => {
      console.log('App isLoggedIn then(data', data.id, data.email)
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
      console.log('fetch e', e)
      return false
    }
    console.log('App isLoggedIn response', response)
    return response

    //     if (response?.id && response.email) {
    //       if (!loggedIn) setLoggedIn(true)
    //       if (!user) setUser(response)
    //     } else {
    //       if (loggedIn) setLoggedIn(false)
    //       if (user) setUser(null)
    //     }
  }
}
export default App
