import React from 'react'
import { shallow, mount } from 'enzyme'

jest.unmock('../menu')
import { DrillableMenu } from '../menu'

const defaultProps = {
  activeNode: 'c',
  children: <div/>,
  dispatch: () => {},
  fetchData: () => {},
  onItemClick: () => {},
  open: true,
  toggle: () => {},
  tree: [{ name: 'bbbb', id: 'b', nodeInfo: { nodes: [ { name: 'CCCC', id: 'c', nodeInfo: { } } ] } }, { name: 'aaaa', id: 'a', nodeInfo: {} }]
}

const subject = (props = {}) => shallow(<DrillableMenu {...{...defaultProps, ...props}}/>)

describe('DrillableMenu', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should find active node', () => {
    expect(subject().find('DrillableMenuHeader').prop('activeNodeName')).toEqual('CCCC')
  });
})
