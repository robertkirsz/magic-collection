import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
// --- Actions ---
import { signIn, signUp, signInWithProvider, clearAuthErrors } from '../store/user'
// --- Assets ---
import googleLogo from '../assets/google-logo.svg'
import facebookLogo from '../assets/facebook-logo.svg'
import twitterLogo from '../assets/twitter-logo.svg'
import githubLogo from '../assets/github-logo.svg'

const mapStateToProps = ({ user, layout }) => ({
  user,
  modalName: layout.modal.name
})

const mapDispatchToProps = { signIn, signUp, signInWithProvider, clearAuthErrors }

class AuthModal extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    signIn: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    signInWithProvider: PropTypes.func.isRequired,
    clearAuthErrors: PropTypes.func.isRequired
  }

  initialState = {
    email: '',
    password: '',
    showPassword: false
  }

  state = this.initialState

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  // Called when modal disappears
  onExited = () => {
    // Clear modal's state
    this.setState(this.initialState)
    // Clear any authentication errors
    if (this.props.user.error) this.props.clearAuthErrors()
  }

  updateForm = (property, value) => e => {
    this.setState({ [property]: value || e.target.value })
  }

  submitForm = e => {
    e.preventDefault()

    const { modalName, signIn, signUp } = this.props

    if (modalName === 'sign in') signIn(this.state)
    if (modalName === 'sign up') signUp(this.state)
  }

  signInWithProvider = provider => e => {
    this.props.signInWithProvider(provider)
  }

  render () {
    const { modalName, user } = this.props
    const { authPending, error } = user
    const { email, password, showPassword } = this.state

    const disableAutocomplete = modalName === 'sign up'

    return (
      <StyledAuthModal onSubmit={this.submitForm} id="authForm">
        <div className="input-wrapper">
          <input
            type="email"
            name={disableAutocomplete ? Date.now().toString() : 'email'}
            placeholder="Email"
            title="Email"
            required
            value={email}
            onChange={this.updateForm('email')}
          />
        </div>
        <div className="input-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name={disableAutocomplete ? Date.now().toString() : 'password'}
            placeholder="Password"
            title="Password"
            required
            value={password}
            onChange={this.updateForm('password')}
          />
          <span className="fa fa-eye" style={showPassword ? { opacity: 1 } : {}} onClick={this.togglePassword} />
        </div>
        {error && <p>{error}</p>}
        <div className="buttons">
          <button type="submit" form="authForm">
            {authPending ? <span className="fa fa-circle-o-notch fa-spin" /> : modalName}
          </button>
          <button onClick={this.signInWithProvider('google')}>
            <img src={googleLogo} alt="Google Logo" />
          </button>
          <button onClick={this.signInWithProvider('facebook')}>
            <img src={facebookLogo} alt="Facebook Logo" />
          </button>
          <button onClick={this.signInWithProvider('twitter')}>
            <img src={twitterLogo} alt="Twitter Logo" />
          </button>
          <button onClick={this.signInWithProvider('github')}>
            <img src={githubLogo} alt="GitHub Logo" />
          </button>
        </div>
      </StyledAuthModal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)

const StyledAuthModal = styled.form`
  .input-wrapper { position: relative; }

  .fa-eye {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px;
    cursor: pointer;
    opacity: 0.5;
    &:hover { opacity: 1; }
  }

  .buttons {
    display: flex;
    button {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      min-height: 34px;
      text-transform: capitalize;
      &:not(:first-of-type) { margin-left: 0.4em; }
      img {
        width: 1.2em;
        height: 1.2em;
      }
    }
  }
`
