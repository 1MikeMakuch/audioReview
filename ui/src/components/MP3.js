import './MP3.css'
import React, {useEffect, useState} from 'react'
import _ from 'lodash'
import {Button, Card, CardDeck} from 'react-bootstrap'
require('dotenv').config() //({path: '../.env'})

function MP3(props) {
  const [comments, setComments] = useState(null)
  const [mp3Test, setMp3Test] = useState(null)
  const loggedIn = props.loggedIn
  const users = props.users
  if (!mp3Test) setMp3Test(props.file)
  let mp3url = process.env.REACT_APP_MP3URL

  useEffect(() => {
    getComments().then(data => {
      setComments(data)
    })
  }, [])

  async function getComments() {
    let request, url

    url = process.env.REACT_APP_SERVER_URL + `/api/comments/${props.file}`
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)

    return await raw.json()
  }

  function handleLike(e) {
    e.preventDefault()
    if (!loggedIn) return
    console.log('handleLike', props.file)
    let request, url

    //     url = process.env.REACT_APP_SERVER_URL + `/api/comments/${props.file}`
    //     request = {
    //       method: 'get',
    //       credentials: 'include'
    //     }

    //    let raw = await fetch(url, request)

    //    return await raw.json()
  }
  function handleComment(e) {
    e.preventDefault()
    if (!loggedIn) return
    console.log('handleComment', props.file)
  }

  let audio = <Button disabled={true}>Play</Button>

  let commentItems
  console.log('MP3 users', users)
  if (comments && comments.length) {
    commentItems = comments.map((comment, i) => {
      let user = _.get(users, comment.userid)
      let nickname = user?.name

      return (
        <CardDeck
          key={i}
          style={{
            borderStyle: 'none none none none',
            borderWidth: '1px',
            borderColor: '#f0f0f0',

            paddingBottom: '5px',
            paddingTop: '5px'
          }}
        >
          {/*          <Card style={{'maxWidth': '8rem'}}>{nickname}</Card> */}
          <Card
            style={{
              borderStyle: 'solid solid solid solid',
              borderColor: '#f7f7f7',
              borderWidth: '5px',
              backgroundColor: '#f7f7f7'
            }}
          >
            <font size="1">{nickname}</font>
            {comment.data}
          </Card>
        </CardDeck>
      )
    })
  }

  if (loggedIn) {
    audio = (
      <audio preload="metadata" controls={true} id="audio_player">
        <source src={`${mp3url}/${props.file}`} type="audio/mpeg" />
        Your browser does not support audio
      </audio>
    )
  }
  return (
    <CardDeck
      style={{
        borderStyle: 'solid solid solid solid',
        borderWidth: '1px',
        borderColor: '#f0f0f0',
        paddingBottom: '10px',
        paddintTop: '10px'
      }}
    >
      <Card style={{maxWidth: '4rem'}}>{props.name}</Card>
      <Card style={{maxWidth: '20rem'}}>
        <div>
          {audio}
          <img style={{maxWidth: '4rem'}} src="http://localhost:7002/like.png" onClick={handleLike} />
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <img style={{maxWidth: '8rem'}} src="http://localhost:7002/comment.png" onClick={handleComment} />
        </div>
      </Card>

      <Card style={{textAlign: 'left'}}>
        <>{commentItems}</>
      </Card>
    </CardDeck>
  )
}

export default MP3
