import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../icon.jsx')
jest.unmock('classnames')
import Icon from '../icon.jsx'

describe('Icon', () => {
  it('should exist', () => {
    const icon = shallow(<Icon />)
    expect(icon).toBeDefined()
  });

  it('can be passed a custom css class', () => {
    const icon = shallow(<Icon className="foo" />)
    expect(icon.find('svg').get(0).props.className).toContain('foo')
  });

  it('can be passed a width', () => {
    const icon = shallow(<Icon width={100} />)
    expect(icon.find('svg').get(0).props.width).toBe(100)
  });

  it('can be passed a height', () => {
    const icon = shallow(<Icon height={100} />)
    expect(icon.find('svg').get(0).props.height).toBe(100)
  })
})
