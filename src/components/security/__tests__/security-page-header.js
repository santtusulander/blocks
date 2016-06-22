import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../security-page-header.jsx')
import SecurityPageHeader from '../security-page-header.jsx'

describe('SecurityPageHeader', () => {
  let props = {}
  let subject = null
  beforeEach(() => {
    props = {
      accounts: fromJS([{ name: 'aaa', id: 1 }, { name: 'bbb', id: 2 }])
    }
    subject = () => shallow(<SecurityPageHeader {...props}/>)
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should pass account options to dropdown', () => {
    expect(subject().find('Select').prop('options')).toEqual([ [ 1, 'aaa' ], [ 2, 'bbb' ] ])
  })
})
