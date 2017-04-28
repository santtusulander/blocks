import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../is-allowed')
import IsAllowed from '../is-allowed'
import { checkUserPermissions } from '../../../../util/permissions'

const testUser = Immutable.Map({
  name: 'test'
})

const subject = (not) => {
  return shallow(
    <IsAllowed
      to="VIEW_ACCOUNT_DETAIL"
      not={not}>
      <div />
    </IsAllowed>,
    {context: {currentUser: testUser}}
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

  it('should call checkUserPermissions with values from context', () => {
    const wrapper = subject(true)
    expect(checkUserPermissions).toBeCalledWith(testUser, "VIEW_ACCOUNT_DETAIL")
  })

})
