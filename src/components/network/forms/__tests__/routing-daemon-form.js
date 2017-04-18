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
    touched = false
  })

  it('should render 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should render 4 fields', () => {
    expect(subject().find('Field').length).toBe(4)
  })

  it('should reflect BGPNumberIsEmpty state change', () => {
    const wrapper = subject()
    wrapper.setState({ BGPNumberIsEmpty: true })

    expect(wrapper.find('input .error-msg').at(0)).toBeTruthy()
  })

  it('should reflect BGPNameNotFound state change', () => {
    const wrapper = subject()
    wrapper.setState({ BGPNameNotFound: true })

    expect(wrapper.find('input .error-msg').at(0)).toBeTruthy()
  })

  it('should reflect BGPNumberInvalid state change', () => {
    const wrapper = subject()
    wrapper.setState({ BGPNumberInvalid: true })

    expect(wrapper.find('input .error-msg').at(0)).toBeTruthy()
  })
})
