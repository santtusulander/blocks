import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../global-loading-bar.jsx')
import GlobalLoadingBar from '../global-loading-bar.jsx'

describe('GlobalLoadingBar', function() {
  let subject = null

  beforeEach(() => {
    subject = (props) => {
      let defaultProps = {
        fetching: false
      }

      const finalProps = Object.assign({}, defaultProps, props)
      return shallow(<GlobalLoadingBar {...finalProps}/>)
    }
  })

  it('should exist', () => {
    const component = subject()
    expect(component).toBeTruthy()
  })

  it('should start animating', () => {
    const component = subject()
    component.setProps({ fetching: true })
    expect(component.find('div').hasClass('animated')).toBe(true)
  })

  it('should stop animating', () => {
    const component = subject()
    component.setProps({ fetching: false })
    expect(component.find('div').hasClass('animated')).toBe(false)
  })
})
