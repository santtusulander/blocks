import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'

jest.dontMock('../manage-account.jsx')
const ManageAccount = require('../manage-account.jsx')

const fakeAccount = Immutable.fromJS({
  id: 1,
  name: "Fake Account"
})

describe('ManageAccount', () => {
  it('should exist', () => {
    const manageAccount = TestUtils.renderIntoDocument(
      <ManageAccount account={fakeAccount}
        params={{account: fakeAccount}}/>
    )
    expect(TestUtils.isCompositeComponent(manageAccount)).toBeTruthy()
  })
})
