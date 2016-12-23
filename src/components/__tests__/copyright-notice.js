import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../copyright-notice')
import CopyrightNotice from '../copyright-notice'

const subject = shallow(
  <CopyrightNotice />
)

describe('CopyrightNotice', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
