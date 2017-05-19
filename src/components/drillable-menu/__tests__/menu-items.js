import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../menu-items')
import Items from '../menu-items'

const defaultProps = {
  menuNodes: [{ name: 'bbbb', nodeInfo: { category: 'a', nodes: [] } }, { name: 'aaaa', nodeInfo: { } }],
  searchValue: '',
  handleCaretClick: () => {},
  onItemClick: () => {}
}

const subject = (props = {}) => shallow(<Items {...{...defaultProps, ...props}}/>)

describe('DrillableMenuItems', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should contain categorized items', () => {
    expect(subject()
      .find('Accordion')
      .prop('headerTitle')
    ).toEqual('a')
  });

  it('should filter out items by search value', () => {
    expect(subject({ searchValue: 'b' })
      .find('MenuItem')
      .length
    ).toEqual(0)
  });
})
