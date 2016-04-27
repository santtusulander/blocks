import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

const handleThemeChange = jest.genMockFunction()
const logOut = jest.genMockFunction()
const activatePurge = jest.genMockFunction()

const fakeLocation = {query: {name: 'www.abc.com'}}

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" location={fakeLocation} />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let header = TestUtils.renderIntoDocument(
      <Header className="foo" theme="dark" location={fakeLocation} />
    );
    let container = TestUtils.findRenderedDOMComponentWithTag(header, 'nav');
    expect(ReactDOM.findDOMNode(container).className).toContain('foo');
  });

  it('should start gradient animation when receiving fetching props', () => {
    // Using ReactDOM.render instead of TestUtils.renderIntoDocument since it
    // will update the component instead of re-rendering if and thus can trigger
    // componentWillReceiveProps event, which is what we are testing here
    let node = document.createElement('div');
    let header = ReactDOM.render(
      <Header theme="dark" fetching={false} location={fakeLocation} />
    , node)
    ReactDOM.render(
      <Header theme="dark" fetching={true} location={fakeLocation} />
    , node)
    expect(header.state.animatingGradient).toBe(true);
  });

  it('should show gradient animation when fetching', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" fetching={true} location={fakeLocation} />
    );
    let gradient = TestUtils.findRenderedDOMComponentWithClass(header, 'header-gradient');
    header.resetGradientAnimation()
    expect(ReactDOM.findDOMNode(gradient).className).toContain('animated');
  });

  it('should not show gradient animation when not fetching', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" fetching={false} location={fakeLocation} />
    );
    let gradient = TestUtils.findRenderedDOMComponentWithClass(header, 'header-gradient');
    header.resetGradientAnimation()
      expect(ReactDOM.findDOMNode(gradient).className).not.toContain('animated');
  });

  it('should call purge function when link is clicked', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" activatePurge={activatePurge} location={fakeLocation} />
    );
    let mainNavLinks = TestUtils.scryRenderedDOMComponentsWithClass(header, 'main-nav-link');
    TestUtils.Simulate.click(mainNavLinks[4]);
    expect(activatePurge.mock.calls.length).toEqual(1);
  });

  it('should call theme handling function when link is clicked', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" handleThemeChange={handleThemeChange} location={fakeLocation} />
    );
    let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'menu-item-theme');
    let links = themeMenu.getElementsByTagName('a');
    TestUtils.Simulate.click(links[1]);
    expect(handleThemeChange.mock.calls.length).toEqual(1);
  });

  it('should call log out function when link is clicked', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" logOut={logOut} location={fakeLocation} />
    );
    let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'bottom-item');
    let links = themeMenu.getElementsByTagName('a');
    TestUtils.Simulate.click(links[0]);
    expect(logOut.mock.calls.length).toEqual(1);
  });
})
