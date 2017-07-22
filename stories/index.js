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
import ModalsHandler from '../src/modals'

import '../src/styles/variables.css'
import '../src/styles/index.css'

storiesOf('Welcome').add('to Storybook', () => <Welcome showApp={linkTo('Button')} />)

storiesOf('Button').add('default', () =>
  <CenteringWrapper>
    <Button onClick={action('clicked')}>Button</Button>
  </CenteringWrapper>
)

storiesOf('Card').add('on search list', () =>
  <Provider store={createStore()}>
    <CenteringWrapper>
      <Card mainCard={mainCard} hoverAnimation detailsPopup onClick={action('clicked')} />
    </CenteringWrapper>
  </Provider>
)

storiesOf('ColorFilter').add('default', () =>
  <CenteringWrapper>
    <ColorFilter colors={colors} onColorChange={e => action('clicked')} />
  </CenteringWrapper>
)

const modalStore = {
  modal: {
    opened: true,
    name: 'error',
    props: {
      message: 'Sample error message'
    }
  }
}

storiesOf('Modal').add('error', () =>
  <Provider store={createStore(modalStore)}>
    <ModalsHandler />
  </Provider>
)
