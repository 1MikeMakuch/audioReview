import React, {useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Card} from 'react-bootstrap'
import './App.css'
import MP3 from './MP3'
import tapes from '../constants'

function Tape(props) {
  const loggedIn = props.loggedIn
  const users = props.users
  const user = props.user
  let tape = props.tape - 1
  let tapeSection = ''
  if (null !== tape && 0 <= tape && tape <= tapes.length) {
    tapeSection = (
      <Card>
        {!loggedIn && <div>Please log in to listen</div>}
        <Card.Body>
          {tapes[tape].map((mp3, i) => (
            <MP3
              key={mp3}
              file={mp3}
              name={Number(tape) + 1 + '-' + (i + 1)}
              loggedIn={loggedIn}
              users={users}
              user={user}
            />
          ))}
        </Card.Body>
      </Card>
    )
  }

  return <div>{tapeSection}</div>
}
export default Tape
