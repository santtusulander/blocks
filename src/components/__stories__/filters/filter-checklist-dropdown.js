import React from 'react';
import Immutable from 'immutable';
import { storiesOf, action } from '@kadira/storybook';

const ThemeWrap = require('../theme-wrap.jsx');

import FilterChecklistDropdown from '../../analysis/filters/filter-checklist-dropdown/filter-checklist-dropdown.jsx'

const options = Immutable.fromJS([
  { link: 'link1', label: 'Property 1' },
  { link: 'link2', label: 'Property 2' },
  { link: 'link3', label: 'Property 3' },
  { link: 'link4', label: 'Property 4' },
  { link: 'link5', label: 'Property 5' },
  { link: 'link6', label: 'Property 6' },
  { link: 'link7', label: 'Property 7' },
  { link: 'link8', label: 'Property 8' },
  { link: 'link9', label: 'Property 9' }
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
