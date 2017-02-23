import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../pod-form')
import PodForm from '../pod-form'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('PodForm', () => {
  let subject, error, props = null
  let touched = false

  beforeEach(() => {
    subject = (pod_name = '', hasNodes = false, showFootprints = false) => {
      props = {
        hasNodes,
        showFootprints,
        accountIsServiceProviderType: false,
        handleSubmit: jest.genMockFunction(),
        asyncValidating: false,
        intl: intlMaker(),
        initialValues: {
          pod_name
        },
        UIFootprints: [],
        fields: {
          name: { touched, error, value: '' },
          locationId: { touched, error, value: [] },
          popId: { touched, error, value: '' }
        }
      }
      return shallow(<PodForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 2 buttons on Add', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have 3 buttons on Edit', () => {
    expect(subject('POD').find('Button').length).toBe(2)
    expect(subject('POD').find('ButtonDisableTooltip').length).toBe(1)
  })

  it('should have delete button enabled if there are no nodes', () => {
    expect(subject('POD').find('ButtonDisableTooltip').node.props.disabled).toBe(false)
  })

  it('should have delete button disabled if there are some nodes', () => {
    expect(subject('POD', true).find('ButtonDisableTooltip').node.props.disabled).toBe(true)
  })

  it('should render an error message', () => {
    touched = true
    expect(
      subject()
        .find('input .error-msg')
        .at(0)
    ).toBeTruthy()
  })
})
