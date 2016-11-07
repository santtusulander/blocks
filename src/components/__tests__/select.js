import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../select.jsx')
import Select from '../select.jsx'
import { Dropdown } from 'react-bootstrap'

describe('Select', () => {
  it('should exist', () => {
    const select = shallow(<Select value={'foo'} options={[['foo', 'bar']]} />)
    expect(select).toBeDefined()
  });

  it('can be passed a custom css class', () => {
    const select = shallow(
      <Select className="aaa" value={'foo'} options={[['foo', 'bar']]} />
    )
    expect(select.find(Dropdown).props().className).toContain('aaa')
  });
})
