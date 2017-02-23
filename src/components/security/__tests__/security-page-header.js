import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../security-page-header')
import SecurityPageHeader from '../security-page-header'

const params = { account: 'bar', group: 'foo' }
const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const subject = shallow(
  <SecurityPageHeader
    params={params}
    intl={intlMaker()} />
)

describe('SecurityPageHeader', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
