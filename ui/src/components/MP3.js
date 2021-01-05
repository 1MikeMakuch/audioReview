import './MP3.css'
import {Button, Card, CardDeck} from 'react-bootstrap'

require('dotenv').config() //({path: '../.env'})

function MP3(props) {
  const loggedIn = props.loggedIn
  var comments = [
    '',
    '',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    '',
    '',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    '',
    '',
    '',
    '',
    '',
    ''
  ]

  let r = parseInt(Math.random() * comments.length)
  let comment = comments[r]
  let mp3url = process.env.REACT_APP_MP3URL

  let audio = <Button disabled={true}>Play</Button>
  if (loggedIn) {
    audio = (
      <audio preload="metadata" controls={true} id="audio_player">
        <source src={`${mp3url}/${props.file}`} type="audio/mpeg" />
        Your browser does not support audio
      </audio>
    )
  }
  return (
    <CardDeck>
      <Card>{props.name}</Card>
      <Card>
        <div>{audio}</div>
      </Card>
      <Card style={{textAlign: 'left'}}>{comment}</Card>
    </CardDeck>
  )
}

export default MP3
