// ---------------------
// Main input component
// ---------------------

import styled, { css } from 'styled-components'
import { colors } from './'

export default styled.div`
  position: relative;
  width: 100%;
  ${({ label }) => label && css`
    margin-top: 25px;
    > label {
      position: absolute;
      top: -25px; left: 0;
      color: #353C41;
      font-size: 13px;
    }
  `}
  > input,
  > textarea {
    width: 100%;
    padding: 14px;
    background: white;
    border: 1px solid #E2E8ED;
    outline: none;
    box-shadow: inset 0 1px 3px 0 rgba(225, 232, 236, 0.7);
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 300;
    transition: border-color 0.3s;
    &:focus { border-color: ${() => colors.darkBlue} }
    &::placeholder { color: #A8B5BE; }
  }
`
