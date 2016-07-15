import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'

jest.mock('../../util/helpers', () => {
  return {
    getAnalyticsUrl: jest.genMockFunction(),
    getContentUrl: jest.genMockFunction(),
    removeProps: jest.genMockFunction()
  }
})

jest.mock('../../routes', () => {
  return {
    getRoute: jest.genMockFunction()
  }
})

jest.autoMockOff() // Uses react-bootstrap extensively, so don't auto mock

jest.dontMock('../header.jsx')
const Header = require('../header.jsx')

function fakeHistoryMaker() {
  return {
    createHref: jest.genMockFunction(),
    isActive: jest.genMockFunction()
  }
}

const handleThemeChange = jest.genMockFunction()
const logOut = jest.genMockFunction()
const activatePurge = jest.genMockFunction()

const fakeLocation = {query: {name: 'www.abc.com'}}

const fakeParams = {brand: 'aaa', account: 'bbb', group: 'ccc', property: 'ddd'}

describe('Header', () => {
  it('should exist', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    );
    expect(TestUtils.isCompositeComponent(header)).toBeTruthy();
  });

  it('can be passed a custom css class', () => {
    let header = TestUtils.renderIntoDocument(
      <Header className="foo"  theme="dark" location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
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
      <Header className="foo"  theme="dark" fetching={false} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    , node)
    expect(header.state.animatingGradient).toBe(false);
    ReactDOM.render(
      <Header className="foo"  theme="dark" fetching={true} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    , node)
    expect(header.state.animatingGradient).toBe(true);
  });

  it('should show gradient animation when fetching', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" fetching={true} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    );
    let gradient = TestUtils.findRenderedDOMComponentWithClass(header, 'header-gradient');
    header.resetGradientAnimation()
    expect(ReactDOM.findDOMNode(gradient).className).toContain('animated');
  });

  it('should not show gradient animation when not fetching', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" fetching={false} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    );
    let gradient = TestUtils.findRenderedDOMComponentWithClass(header, 'header-gradient');
    header.resetGradientAnimation()
    expect(ReactDOM.findDOMNode(gradient).className).not.toContain('animated');
  });

  it('should call theme handling function when link is clicked', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" handleThemeChange={handleThemeChange} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    );
    let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'menu-item-theme');
    let links = themeMenu.getElementsByTagName('a');
    TestUtils.Simulate.click(links[1]);
    expect(handleThemeChange.mock.calls.length).toEqual(1);
  });

  it('should call log out function when link is clicked', () => {
    let header = TestUtils.renderIntoDocument(
      <Header theme="dark" logOut={logOut} location={fakeLocation}
        params={fakeParams} history={fakeHistoryMaker()} />
    );
    let themeMenu = TestUtils.findRenderedDOMComponentWithClass(header, 'bottom-item');
    let links = themeMenu.getElementsByTagName('a');
    TestUtils.Simulate.click(links[0]);
    expect(logOut.mock.calls.length).toEqual(1);
  });
})
