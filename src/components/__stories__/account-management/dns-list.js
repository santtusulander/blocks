import React from 'react'
import { fromJS } from 'immutable'
import { storiesOf, action } from '@kadira/storybook'
import { reducer as formReducer } from 'redux-form'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import { DNSList } from '../../account-management/dns-list.jsx'

const stateReducer = combineReducers({ form: formReducer })
const store = createStore(stateReducer)

const ThemeWrap = require('../theme-wrap.jsx');
const fakeData = require('../../../redux/modules/dns.js').initialState

storiesOf('DNSList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      <Provider store={store}>
        {story()}
      </Provider>
    </ThemeWrap>
  ))
  .add('with no record type', () => (
    <DNSList
      activeDomain={fakeData.get('activeDomain')}
      changeActiveDomain={action('changed active domain')}
      domains={fakeData.get('domains')}
      activeRecordType={fakeData.get('activeRecordType')}
      editSOA={(action('edit SOA'))}
      toggleModal={(action('togge modal'))}
      onAddDomain={action('add domain')}
      onDeleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('with no active domain', () => (
    <DNSList
      changeActiveDomain={action('changed active domain')}
      activeRecordType={fakeData.get('activeRecordType')}
      domains={fakeData.get('domains')}
      editSOA={(action('edit SOA'))}
      onAddDomain={action('add domain')}
      onDeleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('with record type and active domain', () => (
    <DNSList
      changeActiveDomain={action('changed active domain')}
      activeDomain={fakeData.get('activeDomain')}
      editSOA={(action('edit SOA'))}
      domains={fakeData.get('domains')}
      activeRecordType={'AAAA'}
      onAddDomain={action('add domain')}
      onDeleteEntry={action('delete entry')}
      editEntry={action('edit entry')}
      changeRecordType={action('change record type')}
      onAddEntry={action('add entry')}/>
  ))
  .add('DNSList (empty)', () => (
    <DNSList
      onAddDomain={action('add domain')}
      changeActiveDomain={action('changed active domain')}
      domains={fromJS([])}
      editSOA={(action('edit SOA'))}
      onDeleteEntry={action('delete record')}
      editEntry={action('edit record')}/>
  ))
