import React from 'react'
import createStore from '../src/store'
import { Provider } from 'react-redux'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { Button, Welcome } from '@storybook/react/demo'

import { Card, ColorFilter } from '../src/components'

import '../src/styles/variables.css'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module).add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)

const mainCard = {
  artist: 'Jaime Jones',
  cmc: 4,
  colorIdentity: ['W'],
  colors: ['White'],
  flavor: '"The darkness crawls with vampires and ghouls, but we are not without allies."\n—Mikaeus, the Lunarch',
  id: '1db688d574646fcdee55fcd2839149299d084b0b',
  imageName: 'abbey griffin',
  layout: 'normal',
  manaCost: '{3}{W}',
  mciNumber: '1',
  multiverseid: 235595,
  name: 'Abbey Griffin',
  number: '1',
  power: '2',
  rarity: 'Common',
  subtypes: ['Griffin'],
  text: 'Flying, vigilance',
  toughness: '2',
  type: 'Creature — Griffin',
  types: ['Creature'],
  setCode: 'isd',
  variants: [
    {
      artist: 'Jaime Jones',
      cmc: 4,
      colorIdentity: ['W'],
      colors: ['White'],
      flavor: '"The darkness crawls with vampires and ghouls, but we are not without allies."\n—Mikaeus, the Lunarch',
      id: '1db688d574646fcdee55fcd2839149299d084b0b',
      imageName: 'abbey griffin',
      layout: 'normal',
      manaCost: '{3}{W}',
      mciNumber: '1',
      multiverseid: 235595,
      name: 'Abbey Griffin',
      number: '1',
      power: '2',
      rarity: 'Common',
      subtypes: ['Griffin'],
      text: 'Flying, vigilance',
      toughness: '2',
      type: 'Creature — Griffin',
      types: ['Creature'],
      setCode: 'isd',
      image: 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=235595',
      setIcon: 'ss ss-isd ss-common',
      cardUrl: 'abbey-griffin'
    }
  ],
  image: 'http://gatherer.wizards.com/Handlers/Image.ashx?type=card&multiverseid=235595',
  setIcon: 'ss ss-isd ss-common',
  cardUrl: 'abbey-griffin'
}

storiesOf('Card', module).add('on search list', () =>
  <Provider store={createStore()}>
    <Card mainCard={mainCard} hoverAnimation detailsPopup onClick={action('clicked')} />
  </Provider>
)

const colors = {
  White: true,
  Blue: true,
  Black: true,
  Red: true,
  Green: true,
  Colorless: true
}

storiesOf('ColorFilter', module).add('default', () =>
  <ColorFilter colors={colors} onColorChange={e => action('clicked')} />
)
