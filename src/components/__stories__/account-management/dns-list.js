import React from 'react'
import { fromJS, List } from 'immutable'
import { storiesOf, action } from '@kadira/storybook'

const ThemeWrap = require('../theme-wrap.jsx');
const DNSList = require('../../account-management/dns-list.jsx').DNSList

const fakeRecords = fromJS([
  {id: 1, hostName: 'aaa.com', type: 'Firstname Lastname', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 2, hostName: 'aaa.com', type: 'Firstname Lastname', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 3, hostName: 'aaa.com', type: 'Firstname Lastname', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 4, hostName: 'aaa.com', type: 'Firstname Lastname', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 5, hostName: 'aaa.com', type: 'Firstname Lastname', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'}
])
storiesOf('DNSList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Default', () => (
    <DNSList
      records={fakeRecords}
      deleteRecord={action('delete record')}
      editRecord={action('edit record')}/>
  ))
  .add('Empty', () => (
    <DNSList
      records={List()}
      deleteRecord={action('delete record')}
      editRecord={action('edit record')}/>
  ))
