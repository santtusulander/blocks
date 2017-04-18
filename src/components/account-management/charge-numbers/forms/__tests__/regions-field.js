import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../regions-field')
import RegionsField from '../regions-field'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('RegionsField', () => {
  let subject, error, props
  const fields = {
    getAll: jest.fn()
  }

  beforeEach(() => {

    subject = (label = null, required = false, error = false, iterable = []) => {
      props = {
        iterable: iterable,
        label: label,
        required: required,
        fields: fields,
        meta: {
          error: error,
          dirty: error
        },
        intl: intlMaker()
      }
      return shallow(<RegionsField {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render label if passed', () => {
    expect(subject(<div id="label"></div>, true).find('#label').length).toBe(1)
  })

  it('should not render label if not passed', () => {
    expect(subject().find('#label').length).toBe(0)
  })

  it('should show error message if error equals to true', () => {
    expect(subject(null, false, true).find('.has-error').length).toBe(1)
  })

  it('should not show error message if error equals to false', () => {
    expect(subject(null, false, false).find('.has-error').length).toBe(0)
  })

  it('should not render FormControl when items are empty', () => {
    expect(subject(null, false, false, []).find('FormControl').length).toBe(0)
  })

  it('should render FormControl when items are not empty', () => {
    expect(subject(null, false, false, [{label: "test", id: "id"}]).find('FormControl').length).toBe(1)
  })

  it('should render Checkbox when items is not empty', () => {
    expect(subject(null, false, false, [{label: "test", id: "id"}]).find('Checkbox').length).toBe(1)
  })

  it('should render two items when there are two items', () => {
    expect(subject(null, false, false, [{label: "test", id: "id"}, {label: "test", id: "id"}]).find('Checkbox').length).toBe(2)
  })
})
