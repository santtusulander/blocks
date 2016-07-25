import React from 'react'
import { shallow } from 'enzyme'
import { fromJS } from 'immutable'

jest.unmock('../permission-selection.jsx')
import PermissionSelection from '../permission-selection.jsx'

const fakePermissions = fromJS({
  list: {allowed: true},
  create: {allowed: true},
  show: {allowed: true},
  modify: {allowed: true},
  delete: {allowed: true}
})

describe('PermissionSelection', () => {
  it('should exist', () => {
    const permissionSelection = shallow(
      <PermissionSelection permissions={fakePermissions} />
    )
    permissionSelection.find('.permission-selection')
    expect(permissionSelection.find('.permission-selection').length).toBe(1)
  });

  it('can be passed custom className', () => {
    const permissionSelection = shallow(
      <PermissionSelection permissions={fakePermissions} className="foo" />
    )
    expect(permissionSelection.find('.foo').length).toBe(1)
  });

  it('can be passed disabled prop', () => {
    const permissionSelection = shallow(
      <PermissionSelection permissions={fakePermissions} disabled={true} />
    )
    expect(permissionSelection.find('.disabled').length).toBe(1)
  });
})
