import React, { Component } from 'react'
import PropTypes from 'proptypes'
import { connect } from 'react-redux'
import { FormGroup, Radio, ControlLabel, Checkbox, Button } from 'react-bootstrap'
import { toggleSetting, changeCardDetailsPopupDelay, restoreDefaultSettings } from 'store/settings'
import { Flex } from 'styled'

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
      <FormGroup>
        <ControlLabel>Collection lock status</ControlLabel>
        {
          options.map(({ id, value, title }) => (
            <Radio
              key={id}
              name="collectionLockBehaviour"
              value={value}
              checked={this.props.settings.collectionLockBehaviour === value}
              onChange={() => this.props.toggleSetting('collectionLockBehaviour', value)}
            >
              {title}
            </Radio>
          ))
        }
      </FormGroup>
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
      <FormGroup>
        <ControlLabel>Card details popup delay</ControlLabel>
        {
          options.map(({ id, value, title }) => (
            <Radio
              key={id}
              name="cardDetailsPopupDelay"
              value={value}
              checked={this.props.settings.cardDetailsPopupDelay === value}
              onChange={e => { this.props.changeCardDetailsPopupDelay(e.target.value) }}
            >
              {title}
            </Radio>
          ))
        }
      </FormGroup>
    )
  }

  render () {
    const { restoreDefaultSettings, toggleSetting, settings } = this.props
    const { cardModalAnimation, cardHoverAnimation } = settings

    return (
      <Flex column alignItems="center">
        <Flex column>
          <FormGroup>
            <ControlLabel>Animations and transitions</ControlLabel>
            <Checkbox
              checked={cardModalAnimation}
              onChange={e => toggleSetting('cardModalAnimation', e.target.checked)}
            >
              Card modal animation
            </Checkbox>
            <Checkbox
              checked={cardHoverAnimation}
              onChange={e => toggleSetting('cardHoverAnimation', e.target.checked)}
            >
              3D card animation
            </Checkbox>
          </FormGroup>
          {this.renderCollectionLockBehaviourSettings()}
          {this.renderCardDetailsPopupDelaySettings()}
          <Flex justifyContent="flex-end">
            <Button onClick={restoreDefaultSettings}>
              Default settings
            </Button>
          </Flex>
        </Flex>
      </Flex>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsView)
