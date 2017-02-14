import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../routing-daemon-form')
jest.unmock('../../../../util/network-helpers')
import RoutingDaemonForm from '../routing-daemon-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('RoutingDaemonForm', () => {
  let subject, props, error = null
  let touched = false
  const onSave = jest.fn()
  const onCancel = jest.fn()
  const handleSubmit = jest.fn()
  const fetchBGPName = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        onSave,
        onCancel,
        handleSubmit,
        fetchBGPName,
        intl: intlMaker(),
        initialValues: {
          bgp_as_number: '',
          bgp_as_name: '',
          bgp_router_ip: '',
          bgp_password: ''
        },
        fields: {
          bgp_as_number: { touched, error, value: '1111' },
          bgp_as_name: { touched, error, value: '' },
          bgp_router_ip: { touched, error, value: '' },
          bgp_password: { touched, error, value: '' }
        }
      }
      return shallow(<RoutingDaemonForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().find('form').length).toBe(1)
  })

  it('should render an error message', () => {
    touched = true
    expect(subject().find('input .error-msg').at(0)).toBeTruthy()
  })

/*
THIS IS NOT WORKING
Should mock fetchASOverview and see that it has been called 
  it('Should trigger fetch if AS Number field is set & blurred', () => {
    const component = subject();
    component.find('Field').at(0).simulate('blur')

    expect(component.find('LoadingSpinnerSmall').at(1).length).toBe(1)
  })*/
})
