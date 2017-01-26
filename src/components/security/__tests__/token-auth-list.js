import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../token-auth-list')
import TokenAuthList from '../token-auth-list'

const subject = shallow(
  <TokenAuthList />
)

describe('TokenAuthList', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
