import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { Dropdown, MenuItem } from 'react-bootstrap'

import ThemeWrap from './theme-wrap'
import ButtonDropdown from '../button-dropdown'

const defaultProps = {
  bsStyle: 'success',
  disabled: false,
  options: [
    {
      label:'New File Upload',
      handleClick: () => console.log('New File Upload')
    },
    {
      label:'New Folder',
      handleClick: () => console.log('New Folder')
    }
  ],
  pullRight: true
}

storiesOf('Button-dropdown', module)
  .addDecorator((story) => (
    <ThemeWrap>
      {story()}
    </ThemeWrap>
  ))
  .add('Confirmation', () => (
    <center>
      <ButtonDropdown {...defaultProps}/>
    </center>
  ));
