import React, {useState} from 'react'
import './MP3.css'
import {Button, Card, CardDeck, Container} from 'react-bootstrap'
import get from 'lodash/get'
require('dotenv').config() //({path: '../.env'})
var first = true

function MP3(props) {
  const [comments, setComments] = useState(null)
  const [mp3Test, setMp3Test] = useState(null)
  const loggedIn = props.loggedIn
  const users = props.users
  if (!mp3Test) setMp3Test(props.file)

  async function getComments() {
    let request, response, url

    url = process.env.REACT_APP_SERVER_URL + `/api/comments/${props.file}`
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)

    let commentsObj = await raw.json()

    setComments(commentsObj)
    return
  }

  function handleLike(e) {
    e.preventDefault()
    console.log('handleLike', props.file)
  }
  function handleComment(e) {
    e.preventDefault()
    console.log('handleComment', props.file)
  }

  let mp3url = process.env.REACT_APP_MP3URL

  let audio = <Button disabled={true}>Play</Button>

  if (!comments) getComments()

  let commentItems
  if (comments && comments.length) {
    commentItems = comments.map((comment, i) => {
      let user = get(users, comment.userid)
      let nickname = user?.name //String(user?.name).replace(/ .*/, '')
      return (
        <CardDeck
          key={i}
          style={{
            'border-style': 'none none none none',
            'border-width': '1px',
            'border-color': '#f0f0f0',

            'padding-bottom': '5px',
            'padding-top': '5px'
          }}
        >
          {/*          <Card style={{'max-width': '8rem'}}>{nickname}</Card> */}
          <Card
            style={{
              'border-style': 'solid solid solid solid',
              'border-color': '#f7f7f7',
              'border-width': '5px',
              'background-color': '#f7f7f7'
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
        'border-style': 'solid solid solid solid',
        'border-width': '1px',
        'border-color': '#f0f0f0',
        'padding-bottom': '10px',
        'padding-top': '10px'
      }}
    >
      <Card style={{'max-width': '4rem'}}>{props.name}</Card>
      <Card style={{'max-width': '20rem'}}>
        <div>
          {audio}
          <img style={{'max-width': '4rem'}} src="http://localhost:7002/like.png" onClick={handleLike} />
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <img style={{'max-width': '8rem'}} src="http://localhost:7002/comment.png" onClick={handleComment} />
        </div>
      </Card>

      <Card style={{textAlign: 'left'}}>
        <>{commentItems}</>
      </Card>
    </CardDeck>
  )
}

export default MP3
