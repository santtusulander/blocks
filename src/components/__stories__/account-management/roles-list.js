import React from 'react';
import Immutable from 'immutable';
import {storiesOf, action} from '@kadira/storybook';

import ThemeWrap from '../theme-wrap.jsx'
import RolesList from '../../account-management/role-edit/roles-list.jsx'

import {createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import {Provider} from 'react-redux'

const reducers = {
  form: formReducer
}

const reducer = combineReducers(reducers);
const store = createStore(reducer);

import {ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER} from '../../../constants/roles.js'

const RolesListData = Immutable.fromJS([
  {id: 1, roleName: 'Role name #1', roles: [ ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]},
  {id: 2, roleName: 'Role name #2', roles: [ ROLE_UDN,  ROLE_SERVICE_PROVIDER ]},
  {id: 3, roleName: 'Role name #3', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]},
  {id: 4, roleName: 'Role name #4', roles: [ ROLE_UDN ]}
]);

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('RolesList', () => (
      <RolesList roles={RolesListData} onEdit={action('onEdit')}  />
  ))
