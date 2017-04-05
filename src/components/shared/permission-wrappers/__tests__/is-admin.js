import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../is-admin')
import IsAdmin from '../is-admin'

jest.mock('../../../../redux/modules/user', () => {
  return {
    isUdnAdmin: val => val
  }
})

const subject = shallow(
  <IsAdmin
    currentUser={Immutable.Map()}>
    <div />
  </IsAdmin>
)

describe('IsAdmin', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
