import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../selector-component.jsx')
jest.unmock('../toggle-element.jsx')
jest.unmock('../../../decorators/select-auto-close')

import SelectorComponent from '../selector-component.jsx'

describe('SelectorComponent', () => {
  let subject, error, props = null

  const children = React.createElement('div', null, 'Test')
  const drillable = false
  const items = []
  const onCaretClick = jest.genMockFunction()
  const onItemClick = jest.genMockFunction()
  const onSearch = jest.genMockFunction()
  const onSelect = jest.genMockFunction()
  const onTopbarClick = jest.genMockFunction()
  const open = false
  const searchValue = ''
  const toggle = jest.genMockFunction()
  const topBarText = ''

  beforeEach(() => {
     subject = () => {
       props = {
         items,
         drillable,
         children,
         onSelect,
         open,
         toggle,
         topBarText,
         searchValue,
         onSearch,
         onCaretClick,
         onItemClick,
         onTopbarClick
       }
       return shallow(<SelectorComponent {...props}/>)
     }
   })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })
})
