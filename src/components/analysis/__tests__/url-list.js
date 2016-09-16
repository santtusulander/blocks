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
        intl: { formatMessage: jest.fn() }
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
    expect(component.find('td').get(1).props.children).toBe('www.abc.com')
    component.instance().changeSort('url', -1)
    expect(component.find('td').get(1).props.children).toBe('www.ghi.com')
  })

  it('should sort the table by bytes (asc and desc)', () => {
    const component = subject()
    component.instance().changeSort('bytes', 1)
    expect(component.find('td').get(1).props.children).toBe('www.def.com')
    component.instance().changeSort('bytes', -1)
    expect(component.find('td').get(1).props.children).toBe('www.abc.com')
  })

  it('should sort the table by requests (asc and desc)', () => {
    const component = subject()
    component.instance().changeSort('requests', 1)
    expect(component.find('td').get(1).props.children).toBe('www.ghi.com')
    component.instance().changeSort('requests', -1)
    expect(component.find('td').get(1).props.children).toBe('www.abc.com')
  })

  it('should filter out urls according to search value', () => {
    const component = subject()
    component.instance().changeSearch({ target: { value: 'abc' } })
    expect(component.find('tr').length).toBe(2)
  })
})
