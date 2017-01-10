import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../is-allowed')
import IsAllowed from '../is-allowed'

jest.unmock('../../util/permissions')

const subject = (not) => {
  return shallow(
    <IsAllowed
      currentUser={Immutable.Map()}
      roles={Immutable.List()}
      to="VIEW_ACCOUNT_SECTION"
      not={not}>
      <div />
    </IsAllowed>
  )
}

describe('IsAllowed', () => {
 it('should exist', () => {
   expect(subject().length).toBe(1)
   expect(subject(true).length).toBe(1)
 })
})
