import React from 'react';
import { fromJS, List } from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

import ThemeWrap from './theme-wrap.jsx'
import { AccountSidebar } from '../account-sidebar.jsx'

const accounts = fromJS([
  {account_name: 'UDN Admin Account', active: false, account_id: 1},
  {account_name: 'Account Name #2', active: false, account_id: 2},
  {account_name: 'Account Name #3', active: true, account_id: 3}
])

storiesOf('Account sidebar', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('With accounts', () => (
    <AccountSidebar
      accounts={accounts}
      activate={action('account activated')}
      addAccount={action('account added')}
    />
  ))
  .add('Without accounts', () => (
    <AccountSidebar
      accounts={List()}
      activate={action('account activated')}
      addAccount={action('account added')}
    />
  ))
