import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { dispatch } from '../redux'
// --- Components ---
import { Input, Button, ModalContent } from '../styled'
// --- Assets ---
import googleLogo from '../assets/google-logo.svg'
import facebookLogo from '../assets/facebook-logo.svg'
import twitterLogo from '../assets/twitter-logo.svg'
import githubLogo from '../assets/github-logo.svg'

const mapStateToProps = ({ user, modal }) => ({
  user,
  modalName: modal.name
})

class AuthModal extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    onContentClick: PropTypes.func.isRequired
  }

  state = {
    email: '',
    password: '',
    showPassword: false
  }

  componentWillUnmount = () => {
    if (this.props.user.error) dispatch.clearAuthErrors()
  }

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }

  updateForm = (property, value) => e => {
    this.setState({ [property]: value || e.target.value })
  }

  submitForm = e => {
    e.preventDefault()

    const { modalName } = this.props

    if (modalName === 'sign in') dispatch.signIn(this.state)
    if (modalName === 'sign up') dispatch.signUp(this.state)
  }

  signInWithProvider = provider => () => {
    dispatch.signInWithProvider(provider)
  }

  render () {
    const { modalName, user, onContentClick } = this.props
    const { authPending, error } = user
    const { email, password, showPassword } = this.state

    const disableAutocomplete = modalName === 'sign up'

    return (
      <StyledAuthModal onSubmit={this.submitForm} onClick={onContentClick}>
        <div className="input-wrapper">
          <Input
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
          <Input
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
          <Button type="submit">
            {authPending ? <span className="fa fa-circle-o-notch fa-spin" /> : modalName}
          </Button>
          <Button onClick={this.signInWithProvider('google')}>
            <img src={googleLogo} alt="Google Logo" />
          </Button>
          <Button onClick={this.signInWithProvider('facebook')}>
            <img src={facebookLogo} alt="Facebook Logo" />
          </Button>
          <Button onClick={this.signInWithProvider('twitter')}>
            <img src={twitterLogo} alt="Twitter Logo" />
          </Button>
          <Button onClick={this.signInWithProvider('github')}>
            <img src={githubLogo} alt="GitHub Logo" />
          </Button>
        </div>
      </StyledAuthModal>
    )
  }
}

export default connect(mapStateToProps)(AuthModal)

const StyledAuthModal = ModalContent.withComponent('form').extend`
  .input-wrapper {
    position: relative;
    margin-bottom: 1rem;
  }

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
      &[type="submit"] { text-transform: capitalize; }
      &:not(:first-of-type) {
        flex: 1;
        margin-left: 0.4em;
      }
      img {
        width: 1.2em;
        height: 1.2em;
      }
    }
  }
`
