import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const HomeView = () =>
  <StyledHomeView>
    <Link to="/all-cards">All cards</Link>
    <Link to="/my-cards">My cards</Link>
  </StyledHomeView>

export default HomeView

const StyledHomeView = styled.section`
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;

  > a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15vw; height: 15vw;
    border-radius: 1vw;
    font-size: 3rem;
    background: rgb(187, 187, 187);
    color: #333;
  }
`
