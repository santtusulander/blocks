import React from 'react';
import {storiesOf, action} from '@kadira/storybook';

import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux'

import ThemeWrap from '../theme-wrap.jsx'

import AccountManagementFormContainer from '../../account-management/form-container.jsx'
import NewAccountForm from '../../account-management/new-account-form.jsx'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store   = createStore(reducer);

const form = {
  content: <NewAccountForm onSave={action('Save')} onCancel={action('Hide form')}/>,
  title: 'New account',
  subtitle: 'Lorem ipsum dolor'
}

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('AddAccountForm', () => (
    <AccountManagementFormContainer
      show={true}
      onCancel={action('Hide form')}
      title={form.title}
      subtitle={form.subtitle}>
      {form.content}
    </AccountManagementFormContainer>
  ))
