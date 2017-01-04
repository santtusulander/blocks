import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../dns-record-table')
import { DNSRecordTable } from '../dns-record-table'

describe('DNSRecordTable', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        content: jest.fn(),
        shouldHavePrio: true
      }
      return shallow(<DNSRecordTable {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
