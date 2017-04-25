import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'
import { Panel } from 'react-bootstrap'

jest.unmock('classnames')
jest.unmock('../service-option-selector.jsx')

import ServiceOptionSelector from '../service-option-selector.jsx'

const input = {
  onChange: jest.fn(),
  value: Immutable.fromJS([
    {
      service_id: 1,
      billing_meta: {},
      options: [
        {option_id: 1, billing_meta: {}},
        {option_id: 3}
      ]
    }
  ])
}

const options = [
  {
    label: 'Service 1',
    options: [
      {label: 'Option 1-1', value: 1, requires_charge_number: true},
      {label: 'Option 1-2', value: 2, requires_charge_number: false},
      {label: 'Option 1-3', value: 3, requires_charge_number: false}
    ],
    value: 1,
    requires_charge_number: true
  },
  {
    label: 'Service 2',
    options: [
      {label: 'Option 2-1', value: 4, requires_charge_number: false},
      {label: 'Option 2-2', value: 5, requires_charge_number: false},
      {label: 'Option 2-3', value: 6, requires_charge_number: false}
    ],
    value: 2,
    requires_charge_number: true
  },
  {
    label: 'Service 3',
    options: [],
    value: 3,
    requires_charge_number: false
  }
]

let changeValue, showServiceItemForm, onChange, onChangeServiceItem

describe('ServiceOptionSelector', () => {
  let subject, error, props = null

  changeValue = jest.fn()
  showServiceItemForm = jest.fn()
  onChangeServiceItem = jest.fn()
  onChange = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        input,
        options,
        showServiceItemForm,
        onChangeServiceItem,
        changeValue
      }
      return shallow(
        <ServiceOptionSelector {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 panels', () => {
    expect(subject().find(Panel).length).toBe(3)
  })

  it('should have 6 options', () => {
    expect(subject().find('tr').length).toBe(6)
  })

  it('should have 3 enabled items', () => {
    expect(subject().find('.enabled').length).toBe(3)
  })

  it('first service should be enabled', () => {
    const service = subject().find('.multi-option-panel').at(0)

    expect(service.find('div.flex-row').at(0).hasClass('enabled')).toBeTruthy()
  })

  it('second service should not be enabled', () => {
    const service = subject().find('.multi-option-panel').at(1)

    expect(service.find('div.flex-row').at(0).hasClass('enabled')).toBeFalsy()
  })

  it('first option should be enabled', () => {
    const option = subject().find('tr').at(0)

    expect(option.find('div.flex-row').hasClass('enabled')).toBeTruthy()
  })

  it('second option should not be enabled', () => {
    const option = subject().find('tr').at(1)

    expect(option.find('div.flex-row').hasClass('enabled')).toBeFalsy()
  })

  it('should toggle panels', () => {
    const component = subject()

    component.instance().togglePanel(1)
    expect(component.state().openPanels).toContain(1)
    component.instance().togglePanel(1)
    expect(component.state().openPanels).not.toContain(1)
  })

  it('should call onChangeServiceItem and onChange', () => {
    const component = subject()

    component.instance().changeValue(3, null, true, -1)

    const result = { service_id: 3, options: [] }

    expect(input.onChange).toBeCalled()
    expect(onChangeServiceItem).toBeCalled()
  })

  it('should call changeValue if option does not require charge_number', () => {
    const component = subject()

    component.instance().changeValue = jest.fn()
    component.instance().handleOptionClick({requires_charge_number: false}, 0, 3, true, 0)

    expect(component.instance().changeValue).toBeCalled()
    expect(showServiceItemForm).not.toBeCalled()
  })

  it('should not call changeValue if option require charge_number', () => {
    const component = subject()

    component.instance().changeValue = jest.fn()
    component.instance().handleOptionClick({requires_charge_number: true}, 0, 3, true, 0)

    expect(component.instance().changeValue).not.toBeCalled()
    expect(showServiceItemForm).toBeCalled()
  })
})
