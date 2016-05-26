import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

import ThemeWrap from '../theme-wrap.jsx'
import RolesTab from '../../account-management/roles-tab.jsx'

const ROLE_UDN = 'role-udn'
const ROLE_CONTENT_PROVIDER = 'role-content-provider'
const ROLE_SERVICE_PROVIDER = 'role-service-provider'

const RolesList = [
  { id: 1, roleName: 'Role name #1', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 2, roleName: 'Role name #2', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 3, roleName: 'Role name #3', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },
  { id: 4, roleName: 'Role name #4', roles: [ ROLE_UDN, ROLE_CONTENT_PROVIDER, ROLE_SERVICE_PROVIDER ]  },

]

storiesOf('Account Management', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('RolesTab', () => (

      <RolesTab roles={RolesList} onAdd={ action('onAdd') } onEdit={ action('onEdit') }  />
  ))
