import React from 'react'
import { Link } from 'react-router-dom'
import { Div } from '../styled'

const HomeView = props =>
  <Div flex column flexVal={1} style={{ background: 'red' }}>
    <Link to="/all-cards">All cards</Link>
    <Link to="/my-cards">My cards</Link>
  </Div>

export default HomeView
