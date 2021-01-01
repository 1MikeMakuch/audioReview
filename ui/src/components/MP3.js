import './MP3.css'
import {Card, CardDeck} from 'react-bootstrap'

require('dotenv').config() //({path: '../.env'})

function MP3(props) {
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

  return (
    <CardDeck>
      <Card>{props.name}</Card>
      <Card>
        <audio preload="metadata" controls="controls" id="audio_player">
          <source src={`${mp3url}/${props.file}`} type="audio/mpeg" />
          Your browser does not support audio
        </audio>
      </Card>
      <Card style={{textAlign: 'left'}}>{comment}</Card>
    </CardDeck>
  )
}

export default MP3
