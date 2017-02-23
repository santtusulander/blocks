import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../custom-xaxis-tick')
import CustomXAxisTick from '../custom-xaxis-tick'

const subject = shallow(
  <CustomXAxisTick
    payload={
      {index: 0, value:1 },
      {index: 1, value:2 },
      {index: 2, value:3 }
    }
    secondaryXAxisTick={['Jan', 'Feb']} />
)

describe('CustomXAxisTick', () => {
  it('should exist', () => {
    expect(subject).toBeDefined()
  });
})
