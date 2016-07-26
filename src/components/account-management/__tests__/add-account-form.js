import React from 'react'

import {shallow} from 'enzyme'
jest.unmock('../account-form.jsx')

import NewAccountForm from '../account-form.jsx'

describe('AccountForm', () => {
  it('should exist', () => {
    const accountForm = shallow(
      <NewAccountForm />
    )
    expect(accountForm.length).toBe(1)
  })
})
