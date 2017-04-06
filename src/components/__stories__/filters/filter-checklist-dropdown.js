import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('../theme-wrap.jsx');

import FilterChecklistDropdown from '../../shared/form-elements/filter-checklist-dropdown.jsx'

const options = Immutable.fromJS([
  { value: 'link1', label: 'Property 1', checked: true },
  { value: 'link2', label: 'Property 2', checked: true },
  { value: 'link3', label: 'Property 3', checked: false },
  { value: 'link4', label: 'Property 4', checked: false },
  { value: 'link5', label: 'Property 5', checked: true },
  { value: 'link6', label: 'Property 6', checked: false },
  { value: 'link7', label: 'Property 7', checked: false },
  { value: 'link8', label: 'Property 8', checked: false },
  { value: 'link9', label: 'Property 9', checked: false }
]);

storiesOf('Filters', module)
  .addDecorator((story) => (
    <ThemeWrap >
      {story()}
    </ThemeWrap>
  ))
  .add('Filtered Checklist Dropdown', () => (
    <div style={{width: '400px'}}>
      <FilterChecklistDropdown
        options={options}
        handleCheck={action('Handling check')}
      />
    </div>
  ))

  .add('Filtered Checklist Dropdown (Less than five results)', () => (
    <div style={{width: '400px'}}>
      <FilterChecklistDropdown
        options={options.take(3)}
        handleCheck={action('Handling check')}
      />
    </div>
  ))
