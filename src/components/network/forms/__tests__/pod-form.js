import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pod-form')
import PodForm from '../pod-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('PodForm', () => {
  let subject, error, props = null
  let podPermissions = {}

  beforeEach(() => {
    subject = (permissions) => {
      podPermissions = {deleteAllowed: true, modifyAllowed: true, ...permissions}
      props = {
        accountIsServiceProviderType: false,
        handleSubmit: jest.genMockFunction(),
        asyncValidating: false,
        intl: intlMaker(),
        initialValues: {},
        UIFootprints: [],
        podPermissions
      }
      return shallow(<PodForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should not have Submit button if no modify permission', () => {
    expect(subject({modifyAllowed: false}).find('Button[type="submit"]').length).toBe(0);
  })

  it('should not have Delete button if no delete permission', () => {
    expect(subject({deleteAllowed: false}).find('ButtonDisableTooltip').length).toBe(0);
  })
})
