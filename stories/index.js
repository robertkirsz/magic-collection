import React from 'react'
import createStore from '../src/store'
import { Provider } from 'react-redux'

import { storiesOf } from '@storybook/react'
import { Welcome } from '@storybook/react/demo'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import { mainCard, colors } from './data'

import { Card, ColorFilter } from '../src/components'
import { CenteringWrapper, Button } from '../src/styled'

import '../src/styles/variables.css'
import '../src/styles/index.css'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button', module).add('default', () =>
  <CenteringWrapper column>
    <Button onClick={action('clicked')}>Hello Button</Button>
  </CenteringWrapper>
)

storiesOf('Card', module).add('on search list', () =>
  <Provider store={createStore()}>
    <Card mainCard={mainCard} hoverAnimation detailsPopup onClick={action('clicked')} />
  </Provider>
)

storiesOf('ColorFilter', module).add('default', () =>
  <ColorFilter colors={colors} onColorChange={e => action('clicked')} />
)
