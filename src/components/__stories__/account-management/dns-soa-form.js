import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {reducer as formReducer} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import {Map} from 'immutable'

import SoaEditForm from '../../account-management/dns-soa-form.jsx'

const stateReducer = combineReducers({form: formReducer})
const store = createStore(stateReducer)
const ThemeWrap = require('../theme-wrap.jsx')

storiesOf('Add SOA Form', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
      <SoaEditForm
          activeDomain={Map({id: 1, name: 'kung.fu'})}
          onCancel={action('cancel pressed')}
          onSave={action('save pressed')}
      />
  ))
