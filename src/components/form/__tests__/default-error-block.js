import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../default-error-block')
import DefaultErrorBlock from '../default-error-block'

const subject = shallow(
  <DefaultErrorBlock />
)

describe('DefaultErrorBlock', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
