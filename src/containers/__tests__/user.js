import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../user.jsx')
import User from '../user.jsx'

jest.mock('../../util/helpers', () => {
  return {
    getRolesForUser: () => [[0, 1]]
  }
})

function uiActionsMaker() {
  return {
    changeNotification: jest.fn(),
    showInfoDialog: jest.fn()
  }
}

function userActionsMaker() {
  return {
    finishFetching: jest.fn(),
    startFetching: jest.fn(),
    updatePassword: jest.fn(),
    updateUser: jest.fn()
  }
}

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('User', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        intl: intlMaker(),
        uiActions: uiActionsMaker(),
        userActions: userActionsMaker(),
        fetchRoleNames: jest.fn()
      }
      return shallow(<User {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1);
  });
});
