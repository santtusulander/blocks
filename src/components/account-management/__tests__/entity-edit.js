import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../entity-edit')
import EntityEdit from '../entity-edit'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('EntityEdit', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (type = "account") => {
      props = {
        error: error,
        currentUser: Immutable.Map(),
        entityToUpdate: Immutable.Map(),
        onCancel: jest.fn(),
        onDelete: jest.fn(),
        onSave: jest.fn(),
        params: { group: 1, account: 2 },
        type: type,
        intl: intlMaker()
      }

      return shallow(<EntityEdit {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render AddChargeNumbersModal', () => {
    expect(subject("account").find("AccountForm").length).toBe(1)
  })

  it('should render AccountForm if type equal to account', () => {
    expect(subject("account").find("AccountForm").length).toBe(1)
  })

  it('should not render AccountForm if type is not equal to account', () => {
    expect(subject("group").find("AccountForm").length).toBe(0)
  })

  it('should render GroupFormContainer if type equal to account', () => {
    expect(subject("group").find("GroupFormContainer").length).toBe(1)
  })

  it('should not render GroupFormContainer if type is not equal to account', () => {
    expect(subject("account").find("GroupFormContainer").length).toBe(0)
  })
})
