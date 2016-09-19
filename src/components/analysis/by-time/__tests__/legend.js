import React from 'react'
import {shallow} from 'enzyme'

jest.unmock('../legend.jsx')
jest.unmock('classnames')
import Legend from '../legend.jsx'

describe('Legend', () => {
  let subject = null
  beforeEach(() => {
    subject = () => {
      let props = {
        values: ['aa', 'bb', 'cc'],
        dataSets: [
          { comparisonData: true, color: 'aa', label: 'aa' },
          { comparisonData: false, color: 'cc', label: 'bb' }
        ]

      }
      return shallow(<Legend {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1);
  });

  it('should have spans with and without comparison class', () => {
    expect(subject().find('.comparison').length).toBe(1)
  });

  it('should have spans with certain styles', () => {
    const span = subject().find('#legend-line')
    expect(span.get(0).props.style).toEqual({ color: 'aa' })
    expect(span.get(1).props.style).toEqual({ color: 'cc' })
  });

  it('should have spans with certain values', () => {
    const span = subject().find('.legend-value')
    expect(span.get(0).props.children).toBe('aa')
    expect(span.get(1).props.children).toBe('bb')
  });
})
