import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../gtm.jsx')
import ConfigurationGlobalTrafficManager from '../gtm.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('ConfigurationGlobalTrafficManager', () => {
  let subject = null

  beforeEach(() => {
    subject = (readOnly, isFetching) => {
      const initialValues = {
        GTMToggle: true,
        cdnName: 'google.com',
        cName: 'google',
        ROWToggle: true
      }
      return shallow(<ConfigurationGlobalTrafficManager
                      isFetching={isFetching}
                      handleSubmit={() => {}}
                      readOnly={readOnly}
                      intl={intlMaker()}
                      initialValues={initialValues} />
                    )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should display LoadingSpinner when data is loading', () => {
    expect(subject(false, true).find('LoadingSpinner').length).toBe(1)
  })

  it('should not display Toggle when data is loading', () => {
    expect(subject().find('Toggle').length).toBe(0)
  })

  it('should not display LoadingSpinner when data is loaded', () => {
    expect(subject().find('LoadingSpinner').length).toBe(0)
  })

  it('should display five Field components when data is loaded', () => {
    expect(subject().find('Field').length).toBe(5)
  })

  it('should display Add button', () => {
    expect(subject().find('Button').length).toBe(1)
  })

  it('should not display Field components when readOnly prop is passed', () => {
    expect(subject(true).find('Field').length).toBe(0)
  })

  it('should not display Add button when readOnly prop is passed', () => {
    expect(subject(true).find('Button').length).toBe(0)
  })
})
