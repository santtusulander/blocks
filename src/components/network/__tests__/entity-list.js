import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../entity-list')
import EntityList from '../entity-list'

describe('EntityList', () => {
  let subject, error, props = null
  const addEntity = jest.fn()
  const editEntity = jest.fn()

  beforeEach(() => {
    subject = () => {
      props = {
        addEntity,
        editEntity
      }
      return shallow(<EntityList {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
