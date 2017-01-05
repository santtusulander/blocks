import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../global-loading-bar.jsx')
import GlobalLoadingBar from '../global-loading-bar.jsx'

const createNodeMock = () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn()
    }
  }
}

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
    expect(component.instance()).toBeInstanceOf(GlobalLoadingBar)
  })

  it('should start animating', () => {
    const component = subject()
    component.setProps({ fetching: true })
    expect(component.find('div').hasClass('animated')).toBe(true)
  })

  it('should add animation listener on mount', () => {
    const component = subject()
    const gradient = createNodeMock()
    component.instance().gradient = gradient
    component.instance().componentDidMount()
    expect(gradient.addEventListener.mock.calls.length).toBe(1)
  })

  it('should remove animation listener on unmount', () => {
    const component = subject()
    const gradient = createNodeMock()
    component.instance().gradient = gradient
    component.instance().componentWillUnmount()
    expect(gradient.removeEventListener.mock.calls.length).toBe(1)
  })

  it('should be able to loop the animation', () => {
    const component = subject({ fetching: true })
    expect(component.find('div').hasClass('animated')).toBe(true)

    const gradient = createNodeMock()
    component.instance().gradient = gradient
    component.instance().resetGradientAnimation()
    expect(gradient.classList.add.mock.calls.length).toBe(1)
    expect(component.find('div').hasClass('animated')).toBe(true)
  })

  it('should stop animating', () => {
    const component = subject({ fetching: true })
    expect(component.find('div').hasClass('animated')).toBe(true)

    component.setProps({ fetching: false })

    const gradient = createNodeMock()
    component.instance().gradient = gradient
    component.instance().resetGradientAnimation()
    expect(gradient.classList.remove.mock.calls.length).toBe(1)
    expect(component.find('div').hasClass('animated')).toBe(false)
  })
})
