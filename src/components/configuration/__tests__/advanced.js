import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../advanced')
import ConfigurationAdvanced from '../advanced'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('ConfigurationAdvanced', () => {
  let subject = null

  beforeEach(() => {
    subject = (config = Map()) => {
      const initialValues = {
        request: '<html><html>',
        response: '<html><html>',
        final_request: '<html><html>',
        final_response: '<html><html>'
      }

      return shallow(<ConfigurationAdvanced
                      config={config}
                      intl={intlMaker()}
                      initialValues={initialValues} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should display LoadingSpinner when data is loading', () => {
    expect(subject().find('LoadingSpinner').length).toBe(1)
  })

  it('should not display SectionHeader when data is loading', () => {
    expect(subject().find('SectionHeader').length).toBe(0)
  })

  it('should not display LoadingSpinner when data is loaded', () => {
    expect(subject(new Map([{'key': 'value'}])).find('LoadingSpinner').length).toBe(0)
  })

  it('should display four SectionHeader components when data is loaded', () => {
    expect(subject(new Map([{'key': 'value'}])).find('SectionHeader').length).toBe(4)
  })
})
