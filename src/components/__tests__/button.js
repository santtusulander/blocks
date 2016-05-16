import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../button.js')
jest.dontMock('classnames')
const ButtonWrapper = require('../button.js').ButtonWrapper

describe('Button', () => {
  it('should exist', () => {
    const button = shallow(<ButtonWrapper/>)
    expect(button.find('Button').length).toBe(1)
  });

  it('can be passed a class as prop', () => {
    const button = shallow(<ButtonWrapper addNew={true}/>);
    expect(button.find('Button').hasClass('btn-add-new')).toBe(true)
  });

  it('can be passed bsStyle as prop', () => {
    const button = shallow(<ButtonWrapper bsStyle={'primary'}/>);
    expect(button.find('Button').prop('bsStyle')).toBeDefined()
  });

/*


  it('should not set invalid bsStyles', () => {
    const button = renderIntoDocument(<Button bsStyle={'aaa'}/>);
    const button = scryRenderedDOMComponentsWithTag(button, 'li')
    expect(ReactDOM.findDOMNode(button[0]).className).toBe('active')
  });

  it('should filter hidden-attribute', () => {
    const button = renderIntoDocument(<Button hidden={true}/>);
    const button = scryRenderedDOMComponentsWithTag(button, 'li')
    expect(ReactDOM.findDOMNode(button[0]).className).toBe('active')
  });
*/
})
