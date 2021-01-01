import 'bootstrap/dist/css/bootstrap.min.css'
import {Button, Nav, Navbar, Card} from 'react-bootstrap'
//import {Container, Row, Col} from 'react-bootstrap'
//import Accordion from 'react-bootstrap/Accordion'
import './App.css'
import React from 'react'
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import MP3 from './MP3'
import {useState} from 'react'
import tapes from '../constants'
import TopNavbar from './TopNavbar'

function App() {
  return <TopNavbar />
}
export default App
