import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../input-connector.jsx')
import InputConnector from '../input-connector.jsx'

describe('InputConnector', () => {
  let subject = null

  beforeEach(() => {
    subject = (className = 'test', show = true, hasTwoEnds = true, noLabel = true) => {
      return shallow(<InputConnector className={className} show={show} hasTwoEnds={hasTwoEnds} noLabel={noLabel}/>)
    }
  })

  it('should exist', () => {
    expect(subject('', false, false, false).length).toBeTruthy()
  })

  it('can be passed a custom css class', () => {
    expect(subject().find('.test').length).toBeTruthy()
  })

  it('can be passed show parameter', () => {
    expect(subject().find('.show').length).toBeTruthy()
  })

  it('can be passed has-two-ends parameter', () => {
    expect(subject().find('.has-two-ends').length).toBeTruthy()
  })

  it('can be passed no-label parameter', () => {
    expect(subject().find('.no-label').length).toBeTruthy()
  })
})
