import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { Modal } from 'react-bootstrap'
import { signIn, signUp, signInWithProvider, authError, clearAuthErrors } from 'store/user'
import { closeModal } from 'store/layout'
import { googleIcon, facebookIcon, twitterIcon, githubIcon } from 'svg'

const mapStateToProps = ({ user, layout }) => ({
  user,
  modalName: layout.modal.name
})

const mapDispatchToProps = { signIn, signUp, signInWithProvider, authError, clearAuthErrors, closeModal }

class AuthModal extends Component {
  static propTypes = {
    modalName: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
    signIn: PropTypes.func.isRequired,
    signUp: PropTypes.func.isRequired,
    signInWithProvider: PropTypes.func.isRequired,
    authError: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
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

  updateForm = (property, value) => {
    this.setState({ [property]: value })
  }

  submitForm = e => {
    e.preventDefault()

    const { modalName, signIn, signUp } = this.props

    if (modalName === 'sign in') signIn(this.state)
    if (modalName === 'sign up') signUp(this.state)
  }

  render () {
    const { modalName, user, signInWithProvider, closeModal } = this.props
    const { authPending, error } = user
    const { email, password, showPassword } = this.state

    const showModal = modalName === 'sign in' || modalName === 'sign up'
    const disableAutocomplete = modalName === 'sign up'

    return (
      <Modal
        className="auth-modal"
        show={showModal}
        onHide={closeModal}
        bsSize="small"
        onExited={this.onExited}
        style={authPending && { pointerEvents: 'none' }}
        backdrop={authPending ? 'static' : true}
      >
        <Modal.Body>
          <form onSubmit={this.submitForm} id="authForm">
            <div className="form-group">
              <input
                type="email"
                name={disableAutocomplete ? Date.now().toString() : 'email'}
                className="form-control"
                id="emailInput"
                placeholder="Email"
                title="Email"
                required
                value={email}
                onChange={e => this.updateForm('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name={disableAutocomplete ? Date.now().toString() : 'password'}
                className="form-control"
                id="passwordInput"
                placeholder="Password"
                title="Password"
                required
                value={password}
                onChange={e => this.updateForm('password', e.target.value)}
              />
              <span
                className="fa fa-eye"
                style={showPassword ? { opacity: 1 } : {}}
                onClick={this.togglePassword}
              />
            </div>
          </form>
          {error && <p className="text-danger">{error}</p>}
          <div className="buttons">
            <button type="submit" form="authForm" className="btn btn-default">
              {
                authPending
                  ? <span className="fa fa-circle-o-notch fa-spin" />
                  : modalName
              }
            </button>
            <button className="btn btn-default" onClick={() => signInWithProvider('google')}>{googleIcon}</button>
            <button className="btn btn-default" onClick={() => signInWithProvider('facebook')}>{facebookIcon}</button>
            <button className="btn btn-default" onClick={() => signInWithProvider('twitter')}>{twitterIcon}</button>
            <button className="btn btn-default" onClick={() => signInWithProvider('github')}>{githubIcon}</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthModal)
