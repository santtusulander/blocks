import React from 'react';
import {fromJS, List} from 'immutable';
import {storiesOf, action} from '@kadira/storybook';

import ThemeWrap from '../theme-wrap.jsx'
import {AccountManagementSidebar} from '../../account-management/account-management-sidebar.jsx'

const accounts = fromJS([
  {account_name: 'UDN Admin Account', active: false, account_id: 1},
  {account_name: 'Account Name #2', active: false, account_id: 2},
  {account_name: 'Account Name #3', active: true, account_id: 3}
])

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Sidebar (With accounts)', () => (
    <AccountManagementSidebar
      accounts={accounts}
      activate={action('account activated')}
      addAccount={action('account added')}
    />
  ))
  .add('Sidebar (Without accounts)', () => (
    <AccountManagementSidebar
      accounts={List()}
      activate={action('account activated')}
      addAccount={action('account added')}
    />
  ))
