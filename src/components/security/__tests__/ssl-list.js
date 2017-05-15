import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../../../components/shared/action-buttons.jsx')
jest.unmock('../../account-management/account-management-header.jsx')
jest.unmock('../ssl-list.jsx')
import SSLList from '../ssl-list.jsx'

jest.unmock('../../../util/helpers.js')
import { getPage } from '../../../util/helpers.js'

const fakeCerts = fromJS([
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'},
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'},
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'}
])

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('SSLList', () => {

  let subject = null

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = Object.assign({}, {
        intl: intlMaker(),
        groups: fromJS([]),
        certificates: fakeCerts,
        activeCertificates: fromJS([]),
        context: {
          location: {
            pathname: 'foo'
          }
        }
      }, props)
      return shallow(<SSLList {...defaultProps}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show empty message', () => {
    expect(
      subject({certificates: fromJS([])})
        .find('#empty-msg')
        .length
    ).toBe(1)
  })

  it('should list certificates', () => {
    expect(
      subject()
        .find('tbody tr')
        .length
    ).toBe(3)
  })
})
