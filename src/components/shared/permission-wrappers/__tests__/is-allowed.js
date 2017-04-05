import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../is-allowed')
import IsAllowed from '../is-allowed'
import checkPermissions from '../../../../util/permissions'

const testUser = Immutable.Map({
  name: 'test'
})

const testRoles = Immutable.Map({1: 'testRole'})

const subject = (not) => {
  return shallow(
    <IsAllowed
      to="VIEW_ACCOUNT_DETAIL"
      not={not}>
      <div />
    </IsAllowed>,
    {context: {currentUser: testUser, roles: testRoles}}
  )
}

describe('IsAllowed', () => {
  it('should exist', () => {
   expect(subject().length).toBe(1)
  })

  it('should not return div', () => {
    //because roles and currentUser are undefined
   const component = subject(false)
   expect( component.find('div').length).toBe(0)
  })

  it('should return div when "not === true" ', () => {
    const wrapper = subject(true)
    expect( wrapper.find('div').length).toBe(1)
  })

  it('should call checkPermissions with values from context', () => {
    const wrapper = subject(true)
    expect(checkPermissions).toBeCalledWith(testRoles, testUser, "VIEW_ACCOUNT_DETAIL")
  })

})
