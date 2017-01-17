import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../content-provider')
import FilterContentProvider from '../content-provider'

jest.unmock('../../../../decorators/select-auto-close')

const contentProviderOptions = Immutable.fromJS([
  {
    id: 1,
    name: 'foo'
  }
])

const contentProviderGroupOptions = Immutable.fromJS([
  {
    id: 2,
    name: 'bar'
  }
])

describe('FilterContentProvider', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = () => {
      props = {
        changeContentProvider: jest.fn(),
        changeContentProviderGroup: jest.fn(),
        contentProviderGroupOptions,
        contentProviderGroupValue: contentProviderGroupOptions,
        contentProviderValue: contentProviderOptions,
        contentProviderOptions,
        visibleFields: ['cp-account', 'cp-group']
      }
      return shallow(<FilterContentProvider {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
