import React from 'react'
import {fromJS, List} from 'immutable'
import {storiesOf, action} from '@kadira/storybook'

import SSLList from '../../security/ssl-list.jsx'

const ThemeWrap = require('../theme-wrap.jsx');

const fakeCertificates = fromJS([
  {id: 1, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
  {id: 2, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
  {id: 3, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
  {id: 4, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'},
  {id: 5, title: 'SSL 1', commonName: '*.ufd.net', group: 'group 1'},
  {id: 6, title: 'SSL 2', commonName: '*.unifieddelivery.net', group: 'group 3'}
])
storiesOf('SSLList', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('SSLList (Default)', () => (
    <SSLList
      certificates={fakeCertificates}
      uploadCertificate={action('add certificate')}
      deleteCertificate={action('delete certificate')}
      editCertificate={action('edit certificate')}
      onCheck={action('check a box')}/>
  ))
  .add('SSLList (Empty)', () => (
    <SSLList
      certificates={List()}
      uploadCertificate={action('add certificate')}
      deleteCertificate={action('delete certificate')}
      editCertificate={action('edit certificate')}
      onCheck={action('check a box')}/>
  ))
