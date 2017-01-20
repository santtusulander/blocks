import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../../theme-wrap'
import RoutingDaemonForm from '../../../network/forms/routing-daemon-form'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

const dummyFetch = (shouldResolve = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!shouldResolve) {
        return reject({ err: 'Not found' })
      }
      return resolve({ payload: Math.random().toString(36).slice(2) })
    }, 1000)
  })
}

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
      fetchBGPName={dummyFetch}
      show={true}
      onCancel={action('Cancelled')}
      onSave={action('Submitting')}
    />
  ))
