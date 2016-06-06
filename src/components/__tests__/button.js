import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../button.js')
jest.unmock('classnames')
import Button from '../button.js'

describe('Button', () => {
  it('should exist', () => {
    const button = shallow(<Button/>)
    expect(button.find('Button').length).toBe(1)
  });

  it('can be passed a class as prop', () => {
    const button = shallow(<Button addNew={true}/>);
    expect(button.find('Button').hasClass('btn-add-new')).toBe(true)
  });

  it('can be passed bsStyle as prop', () => {
    const button = shallow(<Button bsStyle={'primary'}/>);
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
