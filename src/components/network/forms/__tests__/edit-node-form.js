import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../edit-node-form.jsx')
import NetworkEditNodeForm from '../edit-node-form.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

const mockNodes = [
  {
    id: 'abc.def.123.456',
    name: 'First node',
    node_role: 'cache',
    node_env: 'staging',
    node_type: 'udn_core',
    cloud_driver: 'do',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-16 05:04:03'
  },
  {
    id: 'def.ghj.789.012',
    name: 'Second node',
    node_role: 'cache',
    node_env: 'production',
    node_type: 'udn_core',
    cloud_driver: 'ec2',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-10 05:04:03'
  }
]

describe('NetworkEditNodeForm', () => {
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
        intl: intlMaker(),
        nodes: mockNodes
      }

      return shallow(<NetworkEditNodeForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 4 fields', () => {
    expect(subject().find('Field').length).toBe(4)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have a Delete button', () => {
    expect(subject().find('ButtonDisableTooltip').length).toBe(1)
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
      },
      nodes: mockNodes
    })
    subject.find('form').simulate('submit')
    expect(onSave).toBeCalled();
  })
})
