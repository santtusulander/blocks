import React from 'react'
import { Map } from 'immutable'
import { shallow, mount } from 'enzyme'

jest.unmock('../certificate-form-container.jsx')
import CertificateFormContainer from '../certificate-form-container'

describe('CertificateFormContainer', () => {
  it('should exist', () => {
    const container = shallow(<CertificateFormContainer
      fetchGroups={jest.fn()}
      activeAccount={Map()}
      toEdit={Map()}
      />)
    expect(container.length).toBe(1)
  });
})
