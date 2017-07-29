import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  toggleSetting,
  changeCardDetailsPopupDelay,
  restoreDefaultSettings
} from '../store/settings'
import { Flex, Button } from '../styled'

const mapStateToProps = ({ settings }) => ({ settings })

const mapDispatchToProps = {
  toggleSetting,
  changeCardDetailsPopupDelay,
  restoreDefaultSettings
}

class SettingsView extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    toggleSetting: PropTypes.func.isRequired,
    changeCardDetailsPopupDelay: PropTypes.func.isRequired,
    restoreDefaultSettings: PropTypes.func.isRequired
  }

  renderCollectionLockBehaviourSettings = () => {
    const options = [
      { id: 0, value: 'lockedAtStart', title: 'Locked at start' },
      { id: 1, value: 'unlockedAtStart', title: 'Unlocked at start' },
      { id: 2, value: 'asLeft', title: 'As I left it' }
    ]

    return (
      <div>
        <h4>Collection lock status</h4>
        {options.map(({ id, value, title }) =>
          <label key={id}>
            <input
              type="radio"
              name="collectionLockBehaviour"
              value={value}
              checked={this.props.settings.collectionLockBehaviour === value}
              onChange={() => this.props.toggleSetting('collectionLockBehaviour', value)}
            />
            {title}
          </label>
        )}
      </div>
    )
  }

  renderCardDetailsPopupDelaySettings = () => {
    const options = [
      { id: 0, value: 0, title: 'No delay' },
      { id: 1, value: 1000, title: '1 second' },
      { id: 2, value: 1500, title: '1.5 second' },
      { id: 3, value: 2000, title: '2 seconds' },
      { id: 4, value: false, title: 'Disabled' }
    ]

    return (
      <div>
        <h4>Card details popup delay</h4>
        {options.map(({ id, value, title }) =>
          <label key={id}>
            <input
              type="radio"
              name="cardDetailsPopupDelay"
              value={value}
              checked={this.props.settings.cardDetailsPopupDelay === value}
              onChange={e => {
                this.props.changeCardDetailsPopupDelay(e.target.value)
              }}
            />
            {title}
          </label>
        )}
      </div>
    )
  }

  render () {
    const { restoreDefaultSettings, toggleSetting, settings } = this.props
    const { cardHoverAnimation } = settings

    return (
      <Flex column alignItems="center">
        <Flex column>
          <div>
            <label>
              <input
                type="checkbox"
                checked={cardHoverAnimation}
                onChange={e => toggleSetting('cardHoverAnimation', e.target.checked)}
              />
              3D card animation
            </label>
          </div>
          {this.renderCollectionLockBehaviourSettings()}
          {this.renderCardDetailsPopupDelaySettings()}
          <Flex justifyContent="flex-end">
            <Button onClick={restoreDefaultSettings}>Default settings</Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
