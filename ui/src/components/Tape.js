import 'bootstrap/dist/css/bootstrap.min.css'
import {Card} from 'react-bootstrap'
//import {Container, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'
import './App.css'
import React from 'react'
import MP3 from './MP3'
//import {useState} from 'react'
import tapes from '../constants'
//import Login from './Login'

function Tape(props) {
  const loggedIn = props.loggedIn
  let tape = props.tape - 1

  let tapeSection = ''
  if (null !== tape && 0 <= tape && tape <= tapes.length) {
    tapeSection = (
      <Card>
        {!loggedIn && <div>Please log in to listen</div>}
        <Card.Body>
          {tapes[tape].map((mp3, i) => (
            <MP3 key={i} file={mp3} name={Number(tape) + 1 + '-' + (i + 1)} loggedIn={loggedIn} />
          ))}
        </Card.Body>
      </Card>
    )
  }

  return <div>{tapeSection}</div>
}
export default Tape
