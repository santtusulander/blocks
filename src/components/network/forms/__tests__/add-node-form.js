import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../add-node-form.jsx')
import NetworkAddNodeForm from '../add-node-form.jsx'
import { NETWORK_DOMAIN_NAME } from '../../../../constants/network'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('NetworkAddNodeForm', () => {
  let subject = null
  let nodePermissions = {}
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const onToggleConfirm = jest.fn()
  const handleSubmit = () => {
    onSave() // @TODO could this be handled somehow better?
  }

  beforeEach(() => {
    subject = (permissions = {}) => {
      nodePermissions = {deleteAllowed: true, modifyAllowed: true, ...permissions}
      const props = {
        onSave,
        onCancel,
        onToggleConfirm,
        handleSubmit,
        intl: intlMaker(),
        nodeName: `large.pod1.cache1.SFO.cdx-dev.${NETWORK_DOMAIN_NAME}`,
        nodePermissions
      }

      return shallow(<NetworkAddNodeForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 7 fields', () => {
    expect(subject().find('Field').length).toBe(7)
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
    subject.setProps({
      numNodes: 2
    })
    subject.setState({ showAddConfirmation: true })
    // Check if cancel confirmation button exists aka confirmation is visible
    const cancelButton = subject.find('#cancel-confirm-btn')
    expect(cancelButton.length).toBe(1)
  })

  it('should not have Save button if no modify permission', () => {
    expect(subject({modifyAllowed: false}).find('Button[type="submit"]').length).toBe(0);
  })
})
