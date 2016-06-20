import React from 'react'

import {shallow} from 'enzyme'
jest.unmock('../add-account-form.jsx')

import NewAccountForm from '../add-account-form.jsx'

describe('NewAccountForm', () => {
  it('should exist', () => {
    const accountForm = shallow(
      <NewAccountForm />
    )
    expect(accountForm.length).toBe(1)
  })
})
