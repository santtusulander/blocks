import React from 'react'
import { fromJS, List } from 'immutable'
import { storiesOf, action } from '@kadira/storybook'

const ThemeWrap = require('../theme-wrap.jsx');
const DNSList = require('../../account-management/dns-list.jsx').DNSList

const fakeRecords = fromJS([
  {id: 1, hostName: 'aaa.com', recordType: 'Firstname Lastname', address: 'UDN Superuser', TTL: 'firstname.lastname@company.com'},
  {id: 1, hostName: 'aaa.com', recordType: 'Firstname Lastname', address: 'UDN Superuser', TTL: 'firstname.lastname@company.com'},
  {id: 1, hostName: 'aaa.com', recordType: 'Firstname Lastname', address: 'UDN Superuser', TTL: 'firstname.lastname@company.com'},
  {id: 1, hostName: 'aaa.com', recordType: 'Firstname Lastname', address: 'UDN Superuser', TTL: 'firstname.lastname@company.com'},
  {id: 1, hostName: 'aaa.com', recordType: 'Firstname Lastname', address: 'UDN Superuser', TTL: 'firstname.lastname@company.com'}
])
storiesOf('UserList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <DNSList
      records={fakeRecords}
      deleteUser={action('delete user')}
      editUser={action('edit user')}/>
  ))
  .add('Empty', () => (
    <DNSList
      users={List()}
      deleteUser={action('delete user')}
      editUser={action('edit user')}/>
  ))
