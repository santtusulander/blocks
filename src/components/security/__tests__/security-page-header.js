jest.unmock('../security-page-header')

import React from 'react'
import { shallow } from 'enzyme'

import SecurityPageHeader from '../security-page-header'

function intlMaker() {
  return {
    formatMessage: () => 'bbb'
  }
}

describe('SecurityPageHeader', () => {
  let props = {}
  let subject = null
  beforeEach(() => {
    subject = activAcc => {
      props = {
        activeAccount: activAcc || '',
        intl: intlMaker()
      }
      return shallow(<SecurityPageHeader {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should show active account name', () => {
    expect(subject('asd').find('h1').props().children).toEqual('asd')
  })

  it('should show placeholder if no active account defined', () => {
    expect(subject().find('#active-account').props().children).toEqual('bbb')
  })
})
