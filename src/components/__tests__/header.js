import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme'

import { Navbar } from 'react-bootstrap'

jest.mock('../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.fn(),
    getContentUrl: jest.fn(),
    removeProps: jest.fn(),
    userIsServiceProvider: jest.fn()
  }
})

jest.mock('../../routes', () => {
  return {
    getRoute: jest.fn()
  }
})

// Mock out router
jest.mock('react-router')
const reactRouter = require('react-router')
reactRouter.withRouter = jest.fn(wrappedClass => wrappedClass)

jest.dontMock('../header/header.jsx')
const Header = require('../header/header.jsx').default

function fakeRouterMaker() {
  return {
    createHref: jest.fn(),
    isActive: jest.fn()
  }
}

const handleThemeChange = jest.fn()
const logOut = jest.fn()
const activatePurge = jest.fn()

const fakeLocation = {query: {name: 'www.abc.com'}}

const fakeParams = {brand: 'aaa', account: 'bbb', group: 'ccc', property: 'ddd'}

describe('Header', () => {
  it('should exist', () => {
    const header = shallow(
      <Header theme="dark" location={fakeLocation}
        params={fakeParams} router={fakeRouterMaker()} />
    )
    expect(header).toBeDefined()
  })

  it('can be passed a custom css class', () => {
    const header = shallow(
      <Header className="foo" theme="dark" location={fakeLocation}
        params={fakeParams} router={fakeRouterMaker()} />
    )
    expect(header.find(Navbar).props().className).toContain('foo')
  });

  it('should start gradient animation when receiving fetching props', () => {
    let header = shallow(
      <Header theme="dark" fetching={false} location={fakeLocation}
        params={fakeParams} router={fakeRouterMaker()} />
    )
    expect(header.state('animatingGradient')).toBe(false)
    header = shallow(
      <Header theme="dark" fetching={true} location={fakeLocation}
        params={fakeParams} router={fakeRouterMaker()} />
    )
    expect(header.state('animatingGradient')).toBe(true)
  });
  // TODO: Figure out how to do these with both refs and react-intl
  // it('should show gradient animation when fetching', () => {
  //   const header = mount(
  //     <Header theme="dark" fetching={true} location={fakeLocation}
  //       params={fakeParams} router={fakeRouterMaker()} />
  //   )
  //   header.instance().resetGradientAnimation()
  //   expect(header.find('.header-gradient').props().className).toContain('animated')
  // });
  //
  // it('should not show gradient animation when not fetching', () => {
  //   let header = TestUtils.renderIntoDocument(
  //     <Header theme="dark" fetching={false} location={fakeLocation}
  //       params={fakeParams} router={fakeRouterMaker()} />
  //   );
  //   let gradient = TestUtils.findRenderedDOMComponentWithClass(header, 'header-gradient');
  //   header.resetGradientAnimation()
  //   expect(ReactDOM.findDOMNode(gradient).className).not.toContain('animated');
  // });
  //
  // TODO: These two were refactored into user menu component, so add tests for that
  // it('should pass theme handling function when link is clicked', () => {
  //   const header = shallow(
  //     <Header theme="dark" handleThemeChange={handleThemeChange}
  //       location={fakeLocation} params={fakeParams}
  //       router={fakeRouterMaker()} />
  //   )
  //   let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'menu-item-theme');
  //   let links = themeMenu.getElementsByTagName('a');
  //   TestUtils.Simulate.click(links[1]);
  //   expect(handleThemeChange.mock.calls.length).toEqual(1);
  // });
  //
  // it('should call log out function when link is clicked', () => {
  //   let header = TestUtils.renderIntoDocument(
  //     <Header theme="dark" logOut={logOut} location={fakeLocation}
  //       params={fakeParams} router={fakeRouterMaker()} />
  //   );
  //   let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'bottom-item');
  //   let links = themeMenu.getElementsByTagName('a');
  //   TestUtils.Simulate.click(links[0]);
  //   expect(logOut.mock.calls.length).toEqual(1);
  // });
})
