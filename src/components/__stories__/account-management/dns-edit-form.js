import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

//const ThemeWrap = require('../theme-wrap.jsx');

import ThemeWrap from '../theme-wrap.jsx'
import DnsEditForm from '../../account-management/dns-edit-form.jsx'

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap >
      <div style={ {width: '70%', padding: '3%', border: '1px solid #ccc'} }>
        {story()}
      </div>
    </ThemeWrap>
  ))
  .add('DnsEditForm', () => (
    <DnsEditForm
      show={true}
      edit={false}
      onSave={ action('onSave') }
      onCancel={ action('onCancel')}
      changeValue={ action('changeValue') }
    />
  ))
