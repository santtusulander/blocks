import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import ThemeWrap from '../theme-wrap'
import ASNLookup from '../../shared/ASN-lookup'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

storiesOf('ASN-lookup', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('ASN', () => (
      <ASNLookup />
  ));
