import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('../theme-wrap.jsx');
const UserList = require('../../account-management/user-list.jsx').UserList

const fakeUsers = [
  {id: 1, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 2, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 3, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 4, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'},
  {id: 5, name: 'Firstname Lastname', role: 'UDN Superuser', email: 'firstname.lastname@company.com'},
  {id: 6, name: 'Firstname Lastname', role: 'UDN Viewer', email: 'firstname.lastname@company.com'}
]
storiesOf('UserList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <UserList
      users={fakeUsers}
      deleteUser={action('delete user')}
      editUser={action('edit user')}/>
  ))
