jest.unmock('../filter-checklist-dropdown.jsx');

import React from 'react'
import { FormattedMessage } from 'react-intl'
import { shallow } from 'enzyme'
import { FilterChecklistDropdown } from '../filter-checklist-dropdown.jsx'

describe('FilterChecklistDropdown', function() {
  let subject = null
  beforeEach(() => {
    subject = (className = '') => {
      let props = {
        className,
        open: false,
        toggle: () => {}
      }
      return shallow(<FilterChecklistDropdown {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should display button', () => {
    expect(subject().find('Button').length).toBe(1)
  })

  it('should display icon caret', () => {
    expect(subject().find('IconSelectCaret').length).toBe(1)
  })

  it('should reflect className prop', () => {
    expect(subject('test_class').find('.test_class').length).toBe(1)
  })

  it('should reflect defaultAllSelected prop default behaviour', () => {
    expect(subject().instance().getLabel().props.id).toBe('portal.analytics.dropdownMenu.all')
  })

  it('should reflect defaultAllSelected prop changed', () => {
    const component = subject()

    component.setProps({defaultAllSelected: false})

    expect(component.instance().getLabel().props.id).toBe('portal.analytics.dropdownMenu.pleaseSelect')
  })
})
