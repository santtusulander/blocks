import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../multi-option-selector.jsx')
import MultiOptionSelector from '../multi-option-selector.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const fakeField = {
  onChange: jest.fn(),
  value: Immutable.List([ {id: 1, options: [1, 2]} ])
}

const fakeOptions = [
  {
    label: 'Service 1',
    options: [
      {label: 'Option 1-1', value: 1},
      {label: 'Option 1-2', value: 2},
      {label: 'Option 1-3', value: 3}
    ],
    value: 1
  },
  {
    label: 'Service 2',
    options: [
      {label: 'Option 2-1', value: 1},
      {label: 'Option 2-2', value: 2},
      {label: 'Option 2-3', value: 3}
    ],
    value: 2
  }
]

describe('MultiOptionSelector', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        field: fakeField,
        intl: intlMaker(),
        options: fakeOptions
      }
      return shallow(
        <MultiOptionSelector {...props}/>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('had 2 panels', () => {
    expect(subject().find('.multi-option-panel').length).toBe(2)
  })

  it('toggles panels', () => {
    const component = subject()
    component.instance().togglePanel(1)
    expect(component.state().openPanels).toContain(1)
    component.instance().togglePanel(1)
    expect(component.state().openPanels).not.toContain(1)
  })

  it('handles toggle change', () => {
    const component = subject()
    const option = {
      value: 'foobar',
      options: [{value: 'foo'}, {value: 'bar'}]
    }
    component.instance().handleToggleChange(option, false, 0, 0, false)
    expect(fakeField.onChange.mock.calls[0][0][1].id).toBe('foobar')
    expect(fakeField.onChange.mock.calls[0][0][1].options).toEqual(['foo', 'bar'])
  })

  it('handles checkbox change', () => {
    const component = subject()
    const option = {
      value: 1,
      options: [{value: 1}, {value: 2}]
    }
    const subOption = {value: 'foo'}
    component.instance().handleCheckboxChange(subOption, option, false, 2)
    expect(fakeField.onChange.mock.calls[0][0][0].options).toContain('foo')
  })
})
