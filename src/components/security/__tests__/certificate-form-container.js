import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../certificate-form-container.jsx')
import CertificateFormContainer from '../certificate-form-container.jsx'

describe('CertificateFormContainer', () => {
  it('should exist', () => {
    const container = shallow(<CertificateFormContainer/>);
    expect(container.length).toBe(1);
  });
})
