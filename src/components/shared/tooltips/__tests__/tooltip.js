import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../tooltip.jsx');
import Tooltip from '../tooltip.jsx'

describe('Tooltip', function() {
  let subject = null

  beforeEach(() => {
    subject = (className = 'test', child = (<div></div>), x = 100, y = 200, hidden = false) => {
      return shallow(<Tooltip className={className} x={x} y={y} hidden={hidden}> {child} </Tooltip>)
    }
  })

  it('can be hidden', () => {
    expect(subject('test', <div></div>, 100, 200, true).find('.hidden').length).toBe(1)
  })


  it('can be shown', () => {
    expect(subject('test', <div></div>, 100, 200, false).find('.hidden').length).toBe(0)
  })

  it('can be passed a custom css class', () => {
    expect(subject('test', <div></div>, 100, 200, false).find('.test').length).toBe(1)
  })

  it('renders a child', () => {
    expect(subject('test', <div className='child'></div>, 100, 200, false).find('.child').length).toBe(1)
  })
})
