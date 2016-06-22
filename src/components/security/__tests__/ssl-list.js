import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../ssl-list.jsx')
import SSLList from '../ssl-list.jsx'

const fakeCerts = fromJS([
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'},
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'},
  {id: 1, commonName: 'Firstname Lastname', group: 'UDN Superuser'}
])

describe('SSLList', () => {

  it('should exist', () => {
    const list = shallow(<SSLList/>)
    expect(list.length).toBe(1)
  })

  it('should show empty message', () => {
    const list = shallow(<SSLList certificates={fromJS([])}/>)
    expect(list.find('#empty-msg').length).toBe(1)
  })

  it('should list certificates', () => {
    const list = shallow(<SSLList certificates={fakeCerts} activeCertificates={fromJS([])}/>)
    expect(list.find('tbody tr').length).toBe(3)
  })
})
