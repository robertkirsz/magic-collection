import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  toggleSetting,
  restoreDefaultSettings
} from '../store/settings'
import { Flex, Button } from '../styled'

const mapStateToProps = ({ settings }) => ({ settings })

const mapDispatchToProps = {
  toggleSetting,
  restoreDefaultSettings
}

class SettingsView extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    toggleSetting: PropTypes.func.isRequired,
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
    return (
      <div>
        <h4>Card details popup</h4>
        <Button
          onClick={() =>
            this.props.toggleSetting('cardDetailsPopup')
          }
        >
          {this.props.settings.cardDetailsPopup ? 'Enabled' : 'Disabled'}
        </Button>
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
