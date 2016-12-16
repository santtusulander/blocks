jest.unmock('../filter-checklist-dropdown.jsx');

import React from 'react';
import { shallow } from 'enzyme'
import { FilterChecklistDropdown } from '../filter-checklist-dropdown.jsx'

describe('FilterChecklistDropdown', function() {
  let subject = null
  beforeEach(() => {
    subject = () => {
      let props = {
        open: false,
        toggle: () => {}
      }
      return shallow(<FilterChecklistDropdown {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });
});
