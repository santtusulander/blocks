import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'

jest.unmock('../security.jsx')
import { Security } from '../security.jsx'

describe('Security', () => {
  let subject, props = null
  beforeEach(() => {
    props = {
      fetchAccountData: jest.genMockFunction(),
      activeAccount: Immutable.Map({name: 'foo'}),
      params: { subPage: 'a' },
      location: {pathname: 'bar'},
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
