import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../modal')
jest.unmock('../../decorators/key-stroke-decorator')
import ModalWindow from '../modal'

const fieldsMock = {
  modalField: {}
}

describe('ModalWindow', () => {
  let subject, error, props = null
  const cancel = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        cancel,
        fields: fieldsMock
      }
      return shallow(<ModalWindow {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
