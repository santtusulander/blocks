import React from 'react';
import Immutable from 'immutable';
import {storiesOf, action} from '@kadira/storybook';

import ThemeWrap from '../theme-wrap.jsx'
import {
  BrandList,
  AVAILABILITY_PRIVATE,
  AVAILABILITY_SHARED
} from '../../account-management/brand-list/brand-list.jsx'

const brandList = Immutable.fromJS([
  {id: 1, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_SHARED, lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 2, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: [{accountName: 'Account Name #2'},{accountName: 'Account Name #3'}]},
  {id: 3, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: 'Account Name #1'},
  {id: 4, logo: null, brand: 'Lorem Ipsum', availability: AVAILABILITY_PRIVATE, lastEdited: new Date().toString(), usedBy: 'Account Name #1'}
])

storiesOf('AccountManagement', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('BrandList', () => (

    <BrandList brands={brandList} onAdd={action('onAdd')} onEdit={action('onEdit')} onDelete={action('onDelete')} />
  ))
