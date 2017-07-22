import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const HomeView = () =>
  <StyledHomeView>
    <Link to="/all-cards">All cards</Link>
    <Link to="/my-cards">My cards</Link>
  </StyledHomeView>

export default HomeView

const StyledHomeView = styled.main`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;

  > a {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15vw; height: 15vw;
    min-width: 150px; min-height: 150px;
    margin: 2vw;
    border-radius: 1vw;
    font-size: 3rem;
    background: #BBB;
    color: #333;
    box-shadow: var(--shadow);
  }
`
