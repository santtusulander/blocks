import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../support')
import Support from '../support'

const subject = shallow(
  <Support routes={['foo', 'bar']} />
)

describe('Support', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
