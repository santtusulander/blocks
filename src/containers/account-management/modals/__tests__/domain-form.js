import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../domain-form')
import DnsDomainEditFormContainer from '../domain-form'

const subject = shallow(
  <DnsDomainEditFormContainer />
)

describe('DnsDomainEditFormContainer', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
