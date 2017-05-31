import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../array-td.jsx')
import ArrayTd from '../array-td.jsx'

const fakeItems = ['foo', 'bar', 'zyx', 'baz']

describe('ArrayTd', () => {
  it('should exist', () => {
    const arrayTd = shallow(<ArrayTd items={fakeItems}/>)
    expect(arrayTd.find('.array-td').length).toBe(1)
  })

  it('can be passed a custom class name', () => {
    const arrayTd = shallow(<ArrayTd items={fakeItems} className="test"/>)
    expect(arrayTd.find('.test').length).toBe(1)
  })

  it('should show three first items', () => {
    const arrayTd = shallow(<ArrayTd items={fakeItems}/>)
    expect(arrayTd.text()).toContain('foo, bar, zyx')
  })

  it('should not show fourth item', () => {
    const arrayTd = shallow(<ArrayTd items={fakeItems}/>)
    expect(arrayTd.text()).not.toContain('baz')
    expect(arrayTd.text()).toContain('<OverlayTrigger />')
  })

  it('should not show OverlayTrigger if less than 4 items', () => {
    const arrayTd = shallow(<ArrayTd items={['foo', 'bar', 'zyx']}/>)
    expect(arrayTd.text()).not.toContain('<OverlayTrigger />')
  })

  it('should reflect customText prop', () => {
    const arrayTd = shallow(<ArrayTd
      items={['foo', 'bar', 'zyx', 'zyx', 'zyx']}
      customText={<div className="test">test</div>}
    />)

    expect(arrayTd.find('.test').length).toBe(1)
  })
})
