import './MP3.css'
import {Container, Row, Col} from 'react-bootstrap'

import Comments from './Comments'

function MP3(props) {
  return (
    <Row className="align-items-center" style={{border: '1px', 'border-color': '#eeeeee', 'border-style': 'solid'}}>
      <Col xs={1} />
      <Col xs={1} style={{padding: 0}}>
        {props.file}
      </Col>
      <Col xs={4}>
        <audio controls="controls" id="audio_player">
          <source src="{props.file}" type="audio/mpeg" />
          Your browser does not support audio
        </audio>
      </Col>
      <Col style={{'text-align': 'left'}}>
        Lipsim xyzzy plugh
        <br />
        qwerty asdf asdf
      </Col>
    </Row>
  )
}

export default MP3
