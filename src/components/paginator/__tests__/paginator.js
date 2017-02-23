import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../paginator')
import Paginator from '../paginator'

const subject = shallow(
  <Paginator />
)

describe('Paginator', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
