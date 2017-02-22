import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../edit-node-form.jsx')
import NetworkEditNodeForm, { getNodeValues, MULTIPLE_VALUE_INDICATOR } from '../edit-node-form.jsx'

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
    custom_grains: 'test 1',
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
    custom_grains: 'test 2',
    created: '2016-12-05 12:10:06',
    updated: '2017-01-10 05:04:03'
  }
]

describe('NetworkEditNodeForm', () => {
  let subject = null
  let nodePermissions = {}
  const onCancel = jest.fn()
  const onSave = jest.fn()
  const handleSubmit = () => {
    onSave() // @TODO could this be handled somehow better?
  }

  beforeEach(() => {
    subject = (permissions = {}) => {
      const nodeValues = getNodeValues(mockNodes)
      const initialValues = {}
      for (let field in nodeValues) {
        const value = nodeValues[field]
        initialValues[field] = value === MULTIPLE_VALUE_INDICATOR ? null : value
      }
      nodePermissions = {deleteAllowed: true, modifyAllowed: true, ...permissions};
      const props = {
        show: true,
        onSave,
        onCancel,
        handleSubmit,
        intl: intlMaker(),
        initialValues,
        nodes: mockNodes,
        nodeValues,
        nodePermissions
      }

      return shallow(<NetworkEditNodeForm {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should have 6 fields', () => {
    expect(subject().find('Field').length).toBe(6)
  })

  it('should have 2 buttons', () => {
    expect(subject().find('Button').length).toBe(2)
  })

  it('should have a Delete button', () => {
    expect(subject().find('ButtonDisableTooltip').length).toBe(1)
  })

  it('should submit form', () => {
    subject().find('form').simulate('submit')
    expect(onSave).toBeCalled();
  })

  it('should not have a Delete button if no delete permission', () => {
    expect(subject({deleteAllowed: false}).find('ButtonDisableTooltip').length).toBe(0)
  })

  it('should not have Submit button if no modify permission', () => {
    expect(subject({modifyAllowed: false}).find('Button[type="submit"]').length).toBe(0);
  })
})
