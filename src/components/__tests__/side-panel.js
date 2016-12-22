import React from 'react'
import { shallow } from 'enzyme'
import { SidePanel } from '../side-panel.jsx'

jest.unmock('../side-panel.jsx')

describe('SidePanel', () => {
  let sidePanel = null
  beforeEach(() => {
    sidePanel = (props) => {
      let defaultProps = {
        cancel: jest.fn(),
        className:'testing',
        subTitle:'Testing Side Panel Component',
        title:'Side Panel'
      }
      let finalProps = Object.assign({}, defaultProps, props)
      return shallow(<SidePanel {...finalProps}/>)
    }
  })

  it('should exist', () => {
    expect(sidePanel().length).toBe(1)
  });
})
