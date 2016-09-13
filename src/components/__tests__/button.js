import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../button.jsx')
jest.unmock('classnames')
import UDNButton from '../button.jsx'

describe('Button', () => {
  it('should exist', () => {
    const button = shallow(<UDNButton/>)
    expect(button.find('Button').length).toBe(1)
  });

  it('can be passed a class as prop', () => {
    const button = shallow(<UDNButton addNew={true}/>);
    expect(button.find('Button').hasClass('btn-add-new')).toBe(true)
  });

  it('can be passed bsStyle as prop', () => {
    const button = shallow(<UDNButton bsStyle={'primary'}/>);
    expect(button.find('Button').prop('bsStyle')).toBeDefined()
  });

/*


  it('should not set invalid bsStyles', () => {
    const button = renderIntoDocument(<UDNButton bsStyle={'aaa'}/>);
    const button = scryRenderedDOMComponentsWithTag(button, 'li')
    expect(ReactDOM.findDOMNode(button[0]).className).toBe('active')
  });

  it('should filter hidden-attribute', () => {
    const button = renderIntoDocument(<UDNButton hidden={true}/>);
    const button = scryRenderedDOMComponentsWithTag(button, 'li')
    expect(ReactDOM.findDOMNode(button[0]).className).toBe('active')
  });
*/
})
