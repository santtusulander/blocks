import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../add-node-modal.jsx')
jest.genMockFromModule('react-bootstrap')
import NetworkAddNodeFormContainer from '../add-node-modal.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkAddNodeFormContainer', () => {
  let subject = null

  beforeEach(() => {
    subject = () => {
      let props = {
        closeModal: jest.fn(),
        onSave: jest.fn(),
        intl: intlMaker(),
      }
      return shallow(<NetworkAddNodeFormContainer {...props}/>)
    }
  })

 it('should exist', () => {
   expect(subject().length).toBe(1)
 })
})
