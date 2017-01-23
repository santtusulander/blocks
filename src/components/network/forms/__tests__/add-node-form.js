import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../add-node-form.jsx')
import NetworkAddNodeForm from '../add-node-form.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkAddNodeForm', () => {
  let subject = null
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const handleSubmit = () => {
    onSave() // @TODO could this be handled somehow better?
  }

  beforeEach(() => {
    subject = () => {
      let props = {
        show: true,
        onSave,
        onCancel,
        handleSubmit,
        intl: intlMaker()
      }

      return shallow(<NetworkAddNodeForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 5 fields', () => {
    expect(subject().find('Field').length).toBe(5)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should submit form', () => {
    subject = subject()
    subject.setProps({
      show: true,
      onSave,
      onCancel,
      handleSubmit,
      intl: intlMaker(),
      initialValues: {
        howMany: 4,
        node_type: 'udn_core',
        cloud_driver: 'do'
      }
    })
    subject.find('form').simulate('submit')
    expect(onSave).toBeCalled();
  })

  it('should show confirmation', () => {
    subject = subject()
    subject.setState({ showAddConfirmation: true })
    const cancelButton = subject.find('#cancel-confirm-btn')
    expect(cancelButton.length).toBe(1)
  })
})
