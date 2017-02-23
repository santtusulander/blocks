import React from 'react';
import { shallow } from 'enzyme'
import { FormattedMessage } from 'react-intl'
import {
  UPLOAD_CERTIFICATE,
  EDIT_CERTIFICATE,
  DELETE_CERTIFICATE
} from '../../../../constants/account-management-modals.js'

jest.unmock('../ssl-certificate.jsx');
import TabSslCertificate from '../ssl-certificate.jsx'

function securityActionsMaker() {
  return {
    fetchSSLCertificate: jest.fn(),
    fetchSSLCertificates: jest.fn(),
    startFetching: jest.fn(),
    toggleActiveCertificates: jest.fn()
  }
}

const params = { brand: 'foo', account: 'bar', group: 'zyx' }

describe('TabSslCertificate', function() {
  let error, subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        params,
        securityActions: securityActionsMaker(),
        toggleModal: jest.fn()
      }
      return shallow(<TabSslCertificate {...props} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('shows loading spinner', () => {
    const component = subject()
    component.setProps({ isFetching: true })
    expect(component.find('LoadingSpinner').length).toBe(1)
  })

  it('shows correct modal', () => {
    const component = subject()
    component.setProps({ activeModal: EDIT_CERTIFICATE })
    expect(component.contains(<FormattedMessage id="portal.security.editCertificate.text"/>))
    component.setProps({ activeModal: UPLOAD_CERTIFICATE })
    expect(component.contains(<FormattedMessage id="portal.security.uploadCertificate.text"/>))
    component.setProps({ activeModal: DELETE_CERTIFICATE })
    expect(component.contains(<FormattedMessage id="portal.security.deleteCertificate.text"/>))
  })
})
