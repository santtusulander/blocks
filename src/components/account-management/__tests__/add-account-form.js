import React from 'react'

import {shallow} from 'enzyme'
jest.unmock('../account-form.jsx')

import NewAccountForm from '../account-form.jsx'

const fields = {}

describe('AccountForm', () => {
  it('should exist', () => {
    const accountForm = shallow(
      <NewAccountForm fields={fields} />
    )
    expect(accountForm.length).toBe(1)
  })
})
