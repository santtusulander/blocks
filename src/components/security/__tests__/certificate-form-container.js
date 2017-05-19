import React from 'react'
import { Map } from 'immutable'
import { shallow, mount } from 'enzyme'

jest.unmock('../certificate-form-container.jsx')
import CertificateFormContainer from '../certificate-form-container'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('CertificateFormContainer', () => {
  const fetchGroups = jest.genMockFunction()
  const handleSubmit = jest.genMockFunction()
  let subject, error, props = null
  let touched = false
  beforeEach(() => {
    subject = () => {
      props = {
        activeAccount: '',
        intl: intlMaker(),
        errors: {},
        handleSubmit,
        groupsOptions: [{ label: 'aaa', value: 1 }, { label: 'bbb', value: 2 }],
        fetchGroups,
        certificateToEdit: Map(),
        fields: {
          group: { touched, error, value: '' },
          title: { touched, error, value: ''},
          privateKey: { touched, error, value: '' },
          intermediateCertificates: { touched, error, value: '' },
          certificate: { touched, error, value: '' }
        }
      }
      return shallow(<CertificateFormContainer {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should have "+", Save and Cancel buttons', () => {
    expect(subject().find('Button').length).toBe(3)
  })

  it('should have 2 fields', () => {
    expect(subject().find('Field').length).toBe(2)
  })

  it('should have Dropzone', () => {
    expect(subject().find('Dropzone').length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(subject().find('input .error-msg').at(0)).toBeTruthy()
  })

  it('should not show any list items when files was not loaded', () => {
    expect(subject().find('.key-and-certificates-list').length).toBe(0)
  })

  it('should show list item when Certificate was loaded', () => {
    expect(subject().setState({certificate: 'cert'}).find('.key-and-certificates-list').length).toBe(1)
  })

  it('should show list item when Intermediate Certificates was loaded', () => {
    expect(subject().setState({intermediateCertificates: 'intermid cert'}).find('.key-and-certificates-list').length).toBe(1)
  })

  it('should show list item when Private Key was loaded', () => {
    expect(subject().setState({privateKey: 'key'}).find('.key-and-certificates-list').length).toBe(1)
  })

  it('should not show DropZone when all files loaded', () => {
    expect(subject().setState({privateKey: 'key', certificate: 'cert', intermediateCertificates: 'intermid cert'}).find('Dropzone').length).toBe(0)
  })

  it('should disabel "+" button when all files loaded', () => {
    expect(subject().setState({privateKey: 'key', certificate: 'cert', intermediateCertificates: 'intermid cert'}).find('Button').first().props().disabled).toBe(true)
  })

  it('should disable Save button when Cert or Key or title is missing', () => {
    expect(subject().setState({certificate: 'cert'}).find('Button').at(3).props().disabled).toBe(true)
  })

  it('should enable Save button when Title Key and Cert are added', () => {
    expect(subject().setState({title: "title", privateKey: 'key', certificate: 'cert'}).find('Button').at(3).props().disabled).toBe(false)
  })

  it('should not show Manual Upload Cert Modal when Add Manually was clicked', () => {
    expect(subject().find('CertificateForm').length).toBe(0)
  })

  it('should show Manual Upload Cert Modal when Add Manually was clicked', () => {
    expect(subject().setState({showManuallModal: true}).find('CertificateForm').length).toBe(1)
  })
})
