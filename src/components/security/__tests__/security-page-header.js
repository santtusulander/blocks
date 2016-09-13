import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../security-page-header.jsx')
import SecurityPageHeader from '../security-page-header.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('SecurityPageHeader', () => {
  let props = {}
  let subject = null
  beforeEach(() => {
    props = {
      accounts: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }])
    }
    subject = () => shallow(<SecurityPageHeader {...props} intl={intlMaker()}/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show active account name', () => {
    props = { activeAccount: 'foo' }
    expect(subject().find('h1').props().children).toEqual('foo')
  })

  it('should show placeholder if no active account defined', () => {
    props = { activeAccount: '' }
    expect(subject().find('h1').props().children).toEqual('select account')
  })
})
