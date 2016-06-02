import React from 'react'
import { createStore, combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { Provider } from 'react-redux'

import { fromJS, List } from 'immutable'
import { storiesOf, action } from '@kadira/storybook'

import ThemeWrap from '../theme-wrap.jsx'
import Details from '../../account-management/account/details.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store = createStore(reducer);

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('AccountDetails', () => (
    <Details />
  ));
