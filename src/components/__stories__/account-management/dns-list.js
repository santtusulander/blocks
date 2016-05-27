import React from 'react'
import { fromJS, List } from 'immutable'
import { storiesOf, action } from '@kadira/storybook'

const ThemeWrap = require('../theme-wrap.jsx');
const DNSList = require('../../account-management/dns-list.jsx')

const fakeEntries = fromJS([
  {id: 1, hostName: 'aaa.com', type: 'A', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 2, hostName: 'aaa.com', type: 'AAAA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 3, hostName: 'aaa.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 4, hostName: 'aaa.com', type: 'SOA', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'},
  {id: 5, hostName: 'aaa.com', type: 'TXT', address: 'UDN Superuser', ttl: 'firstname.lastname@company.com'}
])

const fakeDomains = fromJS([
  {id: 1, name: 'ccc.com'},
  {id: 2, name: 'bbb.com'},
  {id: 3, name: 'kung-fu.com'},
  {id: 4, name: 'abba.com'},
  {id: 5, name: 'aaa.com'}
])

const activeDomain = { name: 'kung-fu.com', id: 3 }

storiesOf('DNSList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('with no record type', () => (
    <DNSList
      domains={fakeDomains}
      editSOA={(action('edit SOA'))}
      onAddDomain={action('add domain')}
      entries={fakeEntries}
      deleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('with no active domain', () => (
    <DNSList
      domains={fromJS([])}
      editSOA={(action('edit SOA'))}
      onAddDomain={action('add domain')}
      entries={fakeEntries}
      deleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('with record type and active domain', () => (
    <DNSList
      activeDomain={activeDomain}
      editSOA={(action('edit SOA'))}
      domains={fakeDomains}
      recordType={'AAAA'}
      onAddDomain={action('add domain')}
      entries={fakeEntries}
      deleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('DNSList (empty)', () => (
    <DNSList
      entries={List()}
      editSOA={(action('edit SOA'))}
      deleteEntry={action('delete record')}
      editEntry={action('edit record')}/>
  ))
