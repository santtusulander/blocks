import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../streaming.jsx')
import ConfigurationStreaming from '../streaming.jsx'

describe('ConfigurationStreaming', () => {
  let subject = null

  beforeEach(() => {
    subject = (config = Map()) => {
      return shallow(<ConfigurationStreaming config={config} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should display LoadingSpinner when data is loading', () => {
    expect(subject().find('LoadingSpinner').length).toBe(1)
  })

  it('should not display Toggle when data is loading', () => {
    expect(subject().find('Toggle').length).toBe(0)
  })

  it('should not display LoadingSpinner when data is loaded', () => {
    expect(subject(new Map([{'key': 'value'}])).find('LoadingSpinner').length).toBe(0)
  })

  it('should display Toggle when data is loaded', () => {
    expect(subject(new Map([{'key': 'value'}])).find('Toggle').length).toBe(1)
  })
})
