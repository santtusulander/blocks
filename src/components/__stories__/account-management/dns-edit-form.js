import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'

import ThemeWrap from '../theme-wrap.jsx'
import DnsEditForm from '../../account-management/dns-edit-form.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store = createStore(reducer);

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <Provider store={store}>
        <div style={ {width: '70%', padding: '3%', border: '1px solid #ccc'} }>
          {story()}
        </div>
      </Provider>
    </ThemeWrap>
  ))
  .add('DnsEditForm', () => (
    <DnsEditForm
      show={true}
      edit={false}
      domain='foobar.com'
      onSave={ action('onSave') }
      onCancel={ action('onCancel')}

    />
  ))
