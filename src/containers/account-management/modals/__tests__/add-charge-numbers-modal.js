import React from 'react'
import { shallow } from 'enzyme'

import AddChargeNumbersModal from '../add-charge-numbers-modal'
jest.unmock('../add-charge-numbers-modal')

const props = {
  initialValues: {}
}

const subject = shallow(
  <AddChargeNumbersModal {...props}/>
)

describe('AddChargeNumbersModal', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })
})
