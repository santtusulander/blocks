import React from 'react'
import { shallow } from 'enzyme'
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'

jest.unmock('../security.jsx')
import { Security } from '../security.jsx'

describe('Security', () => {
  let subject, props = null
  beforeEach(() => {
    props = {
      fetchAccountData: jest.genMockFunction(),
      params: { subPage: 'a' },
      securityActions: {
        toggleActiveCertificates: jest.genMockFunction(),
        changeCertificateToEdit: jest.genMockFunction(),
        deleteSSLCertificate: jest.genMockFunction()
      }
    }
    subject = () => shallow(<Security { ...props }/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
})
