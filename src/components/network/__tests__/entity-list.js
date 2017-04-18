import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../entity-list')
import EntityList from '../entity-list'

describe('EntityList', () => {
  let subject, error, props = null
  const addEntity = jest.fn()
  const editEntity = jest.fn()

  beforeEach(() => {
    subject = (multiColumn = false, fetching = false) => {
      props = {
        addEntity,
        editEntity,
        multiColumn: multiColumn,
        fetching: fetching
      }
      return shallow(<EntityList {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render AccountManagementHeader', () => {
    expect(subject().find('AccountManagementHeader').length).toBe(1)
  })

  it('should not render connector-divider by default', () => {
    expect(subject().find('.connector-divider').length).toBe(0)
  })

  it('should not render multiColumn by default', () => {
    expect(subject().find('.multi-column').length).toBe(0)
  })

  it('should render LoadingSpinner while fetching', () => {
    expect(subject(true, true).find('LoadingSpinner').length).toBe(1)
  })

  it('should not render LoadingSpinner if not fetching', () => {
    expect(subject(true, false).find('LoadingSpinner').length).toBe(0)
  })
})
