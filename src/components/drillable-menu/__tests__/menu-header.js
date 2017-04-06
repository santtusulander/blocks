import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../menu-header')
import Header from '../menu-header'

const defaultProps = {
  searchValue: 'a',
  onSearchChange: () => {},
  subtitle: '',
  parentId: '123',
  activeNodeName: 'aaa',
  goToParent: () => {}
}

const subject = (props = {}) => shallow(<Header {...{...defaultProps, ...props}}/>)

describe('DrillableMenuHeader', () => {
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('shows loading text if fetching is true', () => {
    expect(subject({ fetching: true }).find('[id="portal.loading.text"]').length).toBe(1)
  });
})
