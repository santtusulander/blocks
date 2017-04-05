import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../selector-component.jsx')
jest.unmock('../toggle-element.jsx')
jest.unmock('../../../decorators/select-auto-close')

import { SelectorComponent } from '../selector-component.jsx'

describe('SelectorComponent', () => {
  let subject, error, props = null

  const children = React.createElement('div', null, 'Test')
  const onCaretClick = jest.genMockFunction()
  const onItemClick = jest.genMockFunction()
  const onSearch = jest.genMockFunction()
  const onSelect = jest.genMockFunction()
  const onTopbarClick = jest.genMockFunction()
  const open = false
  const searchValue = ''
  const toggle = jest.genMockFunction()

  beforeEach(() => {
     subject = (children = null, items = [], drillable = false, topBarText = '') => {
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
       return shallow(<SelectorComponent {...props}/>).shallow()
     }
   })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })

   it('should not display topBarText when it was not passed', () => {
     expect(subject().find('.top-bar-link').length).toBe(0)
   })

   it('should display topBarText when it was passed', () => {
     expect(subject(null, [], false, 'test').find('.top-bar-link').length).toBe(1)
   })

   it('should not display icon arrow when drillable is falsy', () => {
     expect(subject(null, [1]).find('IconArrowRight').length).toBe(0)
   })

  it('should not display icon arrow when drillable equals true, but there are no items', () => {
    expect(subject(null, [], true).find('IconArrowRight').length).toBe(0)
  })

  it('should display icon arrow when drillable equals true and there are some items', () => {
    expect(subject(null, [1], true).find('IconArrowRight').length).toBe(1)
  })

  it('should display children', () => {
    expect(subject((<div className="children_test"></div>)).find('.children_test').length).toBe(1)
  })

  it('should render items', () => {
    expect(subject(null, [1,2,3]).find('#menu-item').length).toBe(3)
  })
})
