import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {reducer as formReducer} from 'redux-form'
import {createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import { fromJS } from 'immutable'

import CertificateForm from '../../security/certificate-form.jsx'

const stateReducer = combineReducers({form: formReducer})
const store = createStore(stateReducer)
const ThemeWrap = require('../theme-wrap.jsx')

storiesOf('Upload Certificate Form', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('Default', () => (
      <CertificateForm
          accounts={fromJS([{ id: 1, name: 'Account 1' }, { id: 2, name: 'Account 2' } ])}
          groups={fromJS([{ id: 1, name: 'Group 1' }, { id: 2, name: 'Group 2' } ])}
          onCancel={action('cancel pressed')}
          onSave={action('save pressed')}
      />
  ))
