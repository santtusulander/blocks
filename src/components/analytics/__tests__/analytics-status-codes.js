import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../analytics-status-codes')
jest.unmock('../../../decorators/select-auto-close')
import StatusCodes from '../analytics-status-codes'

describe('StatusCodes', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        values: Immutable.List()
      }
      return shallow(<StatusCodes {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
