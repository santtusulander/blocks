import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../../theme-wrap'
import RoutingDaemonForm from '../../../../containers/network/modals/routing-daemon-modal'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

storiesOf('SP-Config', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('RoutingDaemonForm', () => (
    <RoutingDaemonForm
      show={true}
      onCancel={action('Cancelled')}
      onSave={action('Submitting')}
    />
  ))
