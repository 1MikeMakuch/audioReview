import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Nav, Navbar, Card} from 'react-bootstrap'
//import {Container, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'
import './App.css'
import MP3 from './MP3'
import {useState} from 'react'

// prettier-ignore
const tapes =[
  ["0101-01.mp3", "0101-02.mp3", "0101-03.mp3", "0101-04.mp3", "0101-05.mp3", "0101-06.mp3", "0101-07.mp3", "0101-08.mp3", "0101-09.mp3", "0101-10.mp3", "0101-11.mp3", "0101-12.mp3", "0101-13.mp3", "0101-14.mp3", "0101-15.mp3", "0101-16.mp3", "0102-01.mp3", "0102-02.mp3", "0102-03.mp3", "0102-04.mp3", "0102-05.mp3", "0102-06.mp3", "0102-07.mp3", "0102-08.mp3", "0102-09.mp3", "0102-10.mp3"],
   ["0201-01.mp3", "0201-02.mp3", "0201-03.mp3", "0201-04.mp3", "0201-05.mp3", "0201-06.mp3", "0201-07.mp3", "0201-08.mp3", "0201-09.mp3", "0201-10.mp3", "0201-11.mp3", "0201-12.mp3", "0201-13.mp3", "0201-14.mp3", "0201-15.mp3", "0202-01.mp3", "0202-02.mp3", "0202-03.mp3", "0202-04.mp3", "0202-05.mp3", "0202-06.mp3", "0202-07.mp3", "0202-08.mp3"],
   ["0301-01.mp3", "0301-02.mp3", "0301-03.mp3", "0301-04.mp3", "0301-05.mp3", "0301-06.mp3", "0301-07.mp3", "0301-08.mp3", "0301-09.mp3", "0301-10.mp3", "0301-11.mp3", "0301-12.mp3"],
   ["0401-01.mp3", "0401-02.mp3", "0401-03.mp3", "0401-04.mp3", "0401-05.mp3", "0401-06.mp3", "0401-07.mp3", "0401-08.mp3", "0401-09.mp3", "0401-10.mp3", "0401-11.mp3", "0401-12.mp3", "0401-13.mp3"],
   ["0501-01.mp3", "0501-02.mp3", "0501-03.mp3", "0501-04.mp3", "0501-05.mp3", "0501-06.mp3", "0501-07.mp3", "0501-08.mp3", "0501-09.mp3", "0501-10.mp3", "0501-11.mp3", "0501-12.mp3", "0501-13.mp3", "0501-14.mp3", "0501-15.mp3", "0501-16.mp3", "0501-17.mp3", "0501-18.mp3", "0501-19.mp3", "0501-20.mp3", "0501-21.mp3", "0501-22.mp3", "0501-23.mp3", "0502-01.mp3", "0502-02.mp3", "0502-03.mp3", "0502-04.mp3", "0502-05.mp3", "0502-06.mp3", "0502-07.mp3", "0502-08.mp3", "0502-09.mp3", "0502-10.mp3", "0502-11.mp3", "0502-12.mp3", "0502-13.mp3"],
   ["0601-01.mp3", "0601-02.mp3", "0601-03.mp3", "0601-04.mp3", "0601-05.mp3", "0601-06.mp3", "0601-07.mp3", "0601-08.mp3", "0601-09.mp3", "0601-10.mp3", "0601-11.mp3", "0601-12.mp3", "0601-13.mp3", "0601-14.mp3"],
   ["0701-01.mp3", "0701-02.mp3", "0701-03.mp3", "0701-04.mp3", "0701-05.mp3", "0701-06.mp3", "0701-07.mp3", "0701-08.mp3", "0701-09.mp3", "0701-10.mp3", "0701-11.mp3", "0701-12.mp3", "0701-13.mp3", "0701-14.mp3", "0701-15.mp3", "0701-16.mp3", "0702-01.mp3", "0702-02.mp3", "0702-03.mp3", "0702-04.mp3", "0702-05.mp3", "0702-06.mp3", "0702-07.mp3", "0702-08.mp3", "0702-09.mp3", "0702-10.mp3", "0702-11.mp3", "0702-12.mp3", "0702-13.mp3", "0702-14.mp3", "0703-01.mp3", "0703-02.mp3", "0703-03.mp3", "0703-04.mp3", "0703-05.mp3", "0703-06.mp3", "0703-07.mp3", "0703-08.mp3", "0703-09.mp3", "0703-10.mp3", "0703-11.mp3", "0703-12.mp3"],
   ["0801-01.mp3", "0801-02.mp3", "0801-03.mp3", "0801-04.mp3", "0801-05.mp3", "0801-06.mp3", "0801-07.mp3", "0801-08.mp3", "0801-09.mp3", "0801-10.mp3", "0801-11.mp3", "0801-12.mp3", "0801-13.mp3", "0801-14.mp3", "0801-15.mp3", "0801-16.mp3", "0801-17.mp3", "0801-18.mp3", "0801-19.mp3", "0801-20.mp3", "0801-21.mp3", "0802-01.mp3", "0802-02.mp3", "0802-03.mp3", "0802-04.mp3", "0802-05.mp3", "0802-06.mp3", "0802-07.mp3", "0802-08.mp3", "0802-09.mp3", "0802-10.mp3", "0802-11.mp3", "0802-12.mp3", "0802-13.mp3"],
   ["0901-01.mp3", "0901-02.mp3", "0901-03.mp3", "0901-04.mp3", "0901-05.mp3", "0901-06.mp3", "0901-07.mp3", "0901-08.mp3", "0901-09.mp3", "0901-10.mp3", "0901-11.mp3", "0901-12.mp3", "0901-13.mp3", "0901-14.mp3", "0901-15.mp3", "0901-16.mp3", "0901-17.mp3", "0901-18.mp3", "0901-19.mp3", "0901-20.mp3", "0902-01.mp3", "0902-02.mp3", "0902-03.mp3", "0902-04.mp3", "0902-05.mp3", "0902-06.mp3", "0902-07.mp3", "0902-08.mp3", "0902-09.mp3", "0902-10.mp3", "0902-11.mp3"],
   ["1001-01.mp3", "1001-02.mp3", "1001-03.mp3"]
 ]

function App() {
  const [tape, setTape] = useState(1)

  let tapeSection = ''

  tapeSection = (
    <Card>
      <Card.Header>Tape {Number(tapes[tape][0].substr(0, 2))}</Card.Header>

      <Card.Body>
        {tapes[tape].map((mp3, i) => (
          <MP3 key={i} file={mp3} name={Number(tape) + 1 + '-' + (i + 1)} />
        ))}
      </Card.Body>
    </Card>
  )

  console.log('tape', tape)
  return (
    <div className="App">
      <Navbar expand="md" className="customNav" bg="primary" variant="dark" sticky="top">
        <header className="App-header">Dollahite tapes </header>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => setTape(0)}>Tape 1</Nav.Link>
            <Nav.Link onClick={() => setTape(1)}>Tape 2</Nav.Link>
            <Nav.Link onClick={() => setTape(2)}>Tape 3</Nav.Link>
            <Nav.Link onClick={() => setTape(3)}>Tape 4</Nav.Link>
            <Nav.Link onClick={() => setTape(4)}>Tape 5</Nav.Link>
            <Nav.Link onClick={() => setTape(5)}>Tape 6</Nav.Link>
            <Nav.Link onClick={() => setTape(6)}>Tape 7</Nav.Link>
            <Nav.Link onClick={() => setTape(7)}>Tape 8</Nav.Link>
            <Nav.Link onClick={() => setTape(8)}>Tape 9</Nav.Link>
            <Nav.Link onClick={() => setTape(9)}>Tape 10</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {tapeSection}
    </div>
  )
}

export default App
