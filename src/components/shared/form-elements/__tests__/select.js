import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../select.jsx')
import Select from '../select.jsx'
import { Dropdown } from 'react-bootstrap'

describe('Select', () => {
  let subject = null

  beforeEach(() => {
    subject = (value = '1', className = '', autoselectFirst = false) => {
      const props = {
        className,
        value,
        options: [
          {value: '1', label: 'First Option'},
          {value: '2', label: 'Second Option'},
          {value: '3', label: 'Third Option'},
        ],
        autoselectFirst
      }

      return shallow(
        <Select {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject()).toBeDefined()
  });

  it('can be passed a custom css class', () => {
    expect(subject('', 'aaa').find(Dropdown).props().className).toContain('aaa')
  });

  it('autoselectFirst should not work when flag are false', () => {
    expect(subject('', '', false).find('.dropdown-select__selected-item').find('.dropdown-select__option-label').children().props().id).toBe('portal.select.emptyLabel')
  })

  it('autoselectFirst should work when flag are true', () => {
    expect(subject('', '', true).find('.dropdown-select__selected-item').find('.dropdown-select__option-label').text()).toBe('First Option')
  })
})
