import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../toggle-element.jsx')
import ToggleElement from '../toggle-element.jsx'

describe('ToggleElement', () => {
  let subject, error, props = null
  const onClick = jest.genMockFunction()
  const children = React.createElement('div', null, 'Test')

  beforeEach(() => {
     subject = () => {
       props = {
         toggle: onClick,
         children: children
       }

       return shallow(<ToggleElement {...props}/>)
     }
   })

   it('should exist', () => {
     expect(subject().length).toBe(1)
   })

   it('child should exist', () => {
     expect(subject().children()).toContain(children);
   })

   it('should handle click', () => {
     subject().find('.selector-component__toggle').simulate('click')
     expect(onClick.mock.calls.length).toBe(1)
   })
})
