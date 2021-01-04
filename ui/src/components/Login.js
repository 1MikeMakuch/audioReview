import React, {useState} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  function validateForm() {
    return email.length > 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('handleSubmit', email, name)
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group size="lg" controlId="email">
          <Form.Label>
            Please submit your name and email to be emailed a login link.
            <p />
            No password required.
          </Form.Label>

          <Form.Control autoFocus type="name" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />

          <Form.Control
            autoFocus
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Group>

        <Button block size="lg" type="submit" disabled={!validateForm()}>
          Submit
        </Button>
      </Form>
    </div>
  )
}
export default Login
