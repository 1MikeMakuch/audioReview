import './MP3.css'
import {Card, CardDeck, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'

//import Comments from './Comments'

function MP3_ROWS(props) {
  return (
    <Row>
      <Col xs={2}>{props.file}</Col>
      <Col xs={4}>
        <audio preload="metadata" controls="controls" id="audio_player">
          <source src={`http://localhost:7002/${props.file}`} type="audio/mpeg" />
          Your browser does not support audio
        </audio>
      </Col>
      <Col style={{textAlign: 'left'}}>
        Lipsim xyzzy plugh
        <br />
        qwerty asdf asdf
      </Col>
    </Row>
  )
}
function MP3(props) {
  return (
    <CardDeck>
      <Card>{props.file}</Card>
      <Card>
        <audio preload="metadata" controls="controls" id="audio_player">
          <source src={`http://localhost:7002/${props.file}`} type="audio/mpeg" />
          Your browser does not support audio
        </audio>
      </Card>
      <Card style={{textAlign: 'left'}}>
        Lipsim xyzzy plugh
        <br />
        qwerty asdf asdf
      </Card>
    </CardDeck>
  )
}

export default MP3
