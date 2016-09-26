jest.unmock('numeral')
jest.unmock('../url-list')

import React from 'react'
import Immutable from 'immutable'
import { mount } from 'enzyme'

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
      return mount(<URLList {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
  it('should have a row for each url', () => {
    expect(subject().find('tr').length).toBe(4)
  })

  it('should sort the table by url (asc and desc)', () => {
    const component = subject()
    component.instance().changeSort('url', 1)
    expect(component.find('td').at(1).props().children).toContain('www.abc.com')
    component.instance().changeSort('url', -1)
    expect(component.find('td').at(1).props().children).toContain('www.ghi.com')
  })

  it('should sort the table by bytes (asc and desc)', () => {
    const component = subject()
    component.instance().changeSort('bytes', 1)
    expect(component.find('td').at(1).props().children).toContain('www.def.com')
    component.instance().changeSort('bytes', -1)
    expect(component.find('td').at(1).props().children).toContain('www.abc.com')
  })

  it('should sort the table by requests (asc and desc)', () => {
    const component = subject()
    component.instance().changeSort('requests', 1)
    expect(component.find('td').at(1).props().children).toContain('www.ghi.com')
    component.instance().changeSort('requests', -1)
    expect(component.find('td').at(1).props().children).toContain('www.abc.com')
  })

  it('should filter out urls according to search value', () => {
    const component = subject()
    component.setProps({searchState: 'abc'})
    expect(component.find('tr').length).toBe(2)
  })
})
