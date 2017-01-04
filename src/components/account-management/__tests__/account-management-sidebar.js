import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../account-management-sidebar')
import AccountManagementSidebar from '../account-management-sidebar'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('AccountManagementSidebar', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker()
      }
      return shallow(<AccountManagementSidebar {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
