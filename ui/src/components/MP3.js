import './MP3.css'
import React, {useEffect, useState} from 'react'
import Form from 'react-bootstrap/Form'
import _ from 'lodash'
import {Button, Card, CardDeck} from 'react-bootstrap'
require('dotenv').config() //({path: '../.env'})

function MP3(props) {
  //  console.log('MP3 0', props.user)
  const [comments, setComments] = useState(null)
  const [likes, setLikes] = useState(null)
  const [userLikes, setUserLikes] = useState(null)
  const [mp3Test, setMp3Test] = useState(null)
  const [addComment, setAddComment] = useState(null)
  const [commentAdded, setCommentAdded] = useState(false)
  const [newComment, setNewComment] = useState()
  const [loggedInUser, setLoggedInUser] = useState(null)
  const loggedIn = props.loggedIn
  const users = props.users
  //  const user = props.user

  if (!loggedInUser && props && props.user && props.user.id) {
    //console.log('setLoggedInuser')
    setLoggedInUser(props.user)
  } else {
    //console.log('!setLoggedInuser')
  }

  if (!mp3Test) setMp3Test(props.file)
  let mp3url = process.env.REACT_APP_MP3URL

  useEffect(() => {
    getComments().then(data => {
      setComments(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentAdded])
  useEffect(() => {
    getLikes().then(data => {
      setLikes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedInUser])
  useEffect(() => {
    getUserLikes().then(data => {
      setUserLikes(data)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getComments() {
    let request, url

    url = process.env.REACT_APP_SERVER_URL + `/api/comments/${props.file}`
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)
    setCommentAdded(false)
    return await raw.json()
  }
  async function getLikes() {
    let request, url

    url = process.env.REACT_APP_SERVER_URL + `/api/likes/${props.file}`
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)
    let r = await raw.json()

    return r.likes
  }
  async function getUserLikes() {
    if (!loggedInUser) {
      //console.log('getUserLikes 0')
      return 0
    }
    //console.log('getUserLikes', loggedInUser)
    let request, url
    if (!loggedInUser) {
      //console.log('getUserLikes no user!')
      return
    }
    url = process.env.REACT_APP_SERVER_URL + `/api/likes/${props.file}/${loggedInUser.id}`
    request = {
      method: 'get',
      credentials: 'include'
    }

    let raw = await fetch(url, request)
    let r = await raw.json()
    //console.log('getUserLikes', r.likes)
    return r.likes
  }

  function handleLike(e) {
    e.preventDefault()
    if (!loggedIn) return

    let request, url, method

    if (userLikes) {
      method = 'delete'
    } else {
      method = 'post'
    }

    url = process.env.REACT_APP_SERVER_URL + `/api/likes/${props.file}`
    request = {
      method,
      credentials: 'include'
    }
    fetch(url, request).then(async raw => {
      let r = await raw.json()

      if (1 !== r.affectedRows) {
        //console.log('like error', r)
      }
    })
  }
  function handleComment(e) {
    e.preventDefault()
    if (!loggedIn) return
    setAddComment(true)
  }

  function handleAddComment(e) {
    e.preventDefault()
    if (!loggedIn) return

    let request, url

    url = process.env.REACT_APP_SERVER_URL + `/api/comments/${props.file}`
    request = {
      method: 'post',
      body: JSON.stringify({comments: newComment}),
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch(url, request).then(response => {
      setAddComment(false)
      setCommentAdded(true)
    })
  }
  function handleRemoveAddComment(e) {
    e.preventDefault()
    if (!loggedIn) return
    if ('' === e.target.value) {
      setAddComment(false)
      setCommentAdded(true)
    }
  }

  let audio = <Button disabled={true}>Play</Button>

  let commentItems

  if (comments && comments.length) {
    commentItems = comments.map((comment, i) => {
      let commentUser = _.get(users, comment.userid)
      let nickname = commentUser?.name

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
    if (addComment) {
      commentItems.push(
        <CardDeck
          key={commentItems.length}
          style={{
            borderStyle: 'none none none none',
            borderWidth: '1px',
            borderColor: '#f0f0f0',
            paddingBottom: '5px',
            paddingTop: '5px'
          }}
        >
          <Card
            id="addComment"
            style={{
              borderStyle: 'solid solid solid solid',
              borderColor: '#f7f7f7',
              borderWidth: '5px',
              backgroundColor: '#f7f7f7'
            }}
          >
            <font id="addNickName" size="1">
              {loggedInUser.nickname}
            </font>
            <Form onSubmit={e => handleAddComment(e)} onBlur={handleRemoveAddComment}>
              <Form.Group size="lg" controlId="comment">
                <Form.Control autoFocus type="comment" onChange={e => setNewComment(e.target.value)} />
              </Form.Group>
            </Form>
          </Card>
        </CardDeck>
      )
    }
  }

  if (loggedIn) {
    audio = (
      <audio preload="metadata" controls={true} id="audio_player">
        <source src={`${mp3url}/${props.file}`} type="audio/mpeg" />
        Your browser does not support audio
      </audio>
    )
  }
  let likePng
  if (userLikes) {
    likePng = 'liked.png'
  } else {
    likePng = 'like.png'
  }
  //console.log('likePng', props.file, likePng)
  return (
    <CardDeck
      style={{
        borderStyle: 'solid solid solid solid',
        borderWidth: '1px',
        borderColor: '#f0f0f0',
        paddingBottom: '10px',
        paddingTop: '10px'
      }}
    >
      <Card style={{maxWidth: '4rem'}}>{props.name}</Card>
      <figure className="likes">
        <img className="likes" src="http://localhost:7002/likes.png" alt="" />
        <figcaption className="likes">{likes ? likes : ''}</figcaption>
      </figure>
      <Card style={{maxWidth: '20rem'}}>
        <div>
          {audio}
          <img
            className="like"
            style={{
              maxWidth: '10rem'
            }}
            src={`http://localhost:7002/${likePng}`}
            onClick={handleLike}
            alt=""
          />
          &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
          <img
            className="comment"
            style={{maxWidth: '8rem'}}
            src="http://localhost:7002/comment.png"
            onClick={handleComment}
            alt=""
          />
        </div>
      </Card>
      <Card style={{textAlign: 'left'}}>
        <>{commentItems}</>
      </Card>
    </CardDeck>
  )
}

export default MP3
