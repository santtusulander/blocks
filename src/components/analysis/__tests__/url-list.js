import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../url-list')
import URLList from '../url-list'

const fakeURLs = Immutable.fromJS([
  {
    url: 'www.def.com',
    bytes: 1000,
    requests: 2000
  },
  {
    url: 'www.abc.com',
    bytes: 4000,
    requests: 3000
  },
  {
    url: 'www.ghi.com',
    bytes: 2000,
    requests: 1000
  }
])

describe('URLList', () => {
  let subject = null
  let props = {}
  const labelFormat = jest.fn()
  beforeEach(() => {
    subject = () => {
      props = {
        urls: fakeURLs,
        labelFormat,
        intl: { formatMessage: jest.fn() },
        searchState: ''
      }
      return shallow(<URLList {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
  it('should have a row for each url', () => {
    expect(subject().find('tr').length).toBe(4)
  })

  it('should change the state by calling changeSort', () => {
    const component = subject()
    component.instance().changeSort('url', 1)
    expect(component.state().sortDir).toBe(1);
    component.instance().changeSort('url', -1)
    expect(component.state().sortDir).toBe(-1);
  })

  it('should filter out urls according to search value', () => {
    const component = subject()
    component.setProps({searchState: 'abc'})
    expect(component.find('tr').length).toBe(2)
  })
})
