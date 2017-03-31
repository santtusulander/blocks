import React from 'react'
import { Map, List } from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../global-account-selector.jsx')
jest.unmock('../../../decorators/select-auto-close')
import AccountSelector from '../global-account-selector.jsx'

jest.unmock('../../../decorators/select-auto-close')

describe('AccountSelector', () => {
  let subject, error, props = null

  const currentUser = new Map()
  const roles = new Map()
  const items = new List()
  const fetchItems = jest.genMockFunction()
  const getChangedItem = jest.genMockFunction()
  const onSelect = jest.genMockFunction()
  const open = false
  const params = {brand: 'udn', account: '1'}
  const resetChanged = jest.genMockFunction()
  const restrictedTo = ''
  const searchValue = 'test'
  const startTier = ''
  const as = 'configuration'
  const topBarAction = jest.genMockFunction()
  const topBarTexts = {}
  const accountSelectorActions = {
    setOpen: () => jest.genMockFunction(),
    setSearch: () => jest.genMockFunction(),
    fetchItems: () => Promise.resolve()
  }

  beforeEach(() => {
    subject = () => {
      props = {
        as,
        accountSelectorActions,
        currentUser,
        fetchItems,
        getChangedItem,
        items,
        onSelect,
        open,
        params,
        resetChanged,
        restrictedTo,
        roles,
        searchValue,
        startTier,
        topBarAction,
        topBarTexts
      }

      return shallow(<AccountSelector {...props}/>)
    }
  })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })
})
