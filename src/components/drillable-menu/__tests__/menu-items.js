import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../menu-items')
import Items from '../menu-items'

const defaultProps = {
  menuNodes: [{ name: 'bbbb', nodeInfo: { nodes: [] } }, { name: 'aaaa', nodeInfo: {} }],
  searchValue: '',
  handleCaretClick: () => {},
  onItemClick: () => {}
}

const subject = (props = {}) => shallow(<Items {...{...defaultProps, ...props}}/>)

describe('DrillableMenuItems', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should show sorted items', () => {
    expect(subject()
        .find('.scrollable-menu')
        .childAt(0)
        .contains(<span>aaaa</span>
        )).toEqual(true)
  });

  it('should show filtered items by search value', () => {
    expect(subject({ searchValue: 'b' })
          .find('.scrollable-menu')
          .childAt(0)
          .contains(<span>bbbb</span>
          )).toEqual(true)
  });
})
