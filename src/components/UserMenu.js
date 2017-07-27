import React, { Component } from 'react'
import PropTypes from 'prop-types'
import onClickOutside from 'react-onclickoutside'
// --- Components ---
import { UserBadge, UserDropdownMenu } from './'

class UserMenu extends Component {
  static propTypes = {
    userSignedIn: PropTypes.bool.isRequired,
    style: PropTypes.object
  }

  state = { isDropdownVisible: false }

  toggleDropdown = () => {
    this.setState({ isDropdownVisible: !this.state.isDropdownVisible })
  }

  hideDropdown = () => {
    this.setState({ isDropdownVisible: false })
  }

  handleClickOutside = () => {
    this.hideDropdown()
  }

  render = () =>
    <div style={this.props.style}>
      <UserBadge onClick={this.toggleDropdown} />
      <UserDropdownMenu
        show={this.props.userSignedIn && this.state.isDropdownVisible}
        onHide={this.hideDropdown}
      />
    </div>
}

export default onClickOutside(UserMenu)
