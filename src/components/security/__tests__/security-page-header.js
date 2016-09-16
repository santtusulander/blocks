import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../security-page-header')
jest.unmock('react-intl')
import SecurityPageHeader from '../security-page-header'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('SecurityPageHeader', () => {
  let props = {}
  let subject = null
  beforeEach(activAcc => {
    props = {
      activeAccount: activAcc || '',
      intl: intlMaker()
    }
    subject = () => shallow(<SecurityPageHeader {...props}/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show active account name', () => {
    expect(subject('asd').find('h1').props().children).toEqual('foo')
  })

  it('should show placeholder if no active account defined', () => {
    expect(subject().find('h1').props().children).toEqual('select account')
  })
})
