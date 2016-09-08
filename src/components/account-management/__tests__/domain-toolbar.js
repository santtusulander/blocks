import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../domain-toolbar')
//jest.unmock('../../is-allowed')
jest.unmock('react-intl')
import DomainToolbar from '../domain-toolbar'

describe('Button', () => {
  let props = {}
  let subject = null

  beforeEach(() => {
    subject = (activeDomain, domains, searchValue) => {
      props = {
        activeDomain: activeDomain || 'aa',
        domains: domains || [ 'aa', 'bb' ],
        searchValue: searchValue || 'aa',
        onAddDomain: jest.genMockFunction(),
        onEditDomain: jest.genMockFunction(),
        searchFunc: jest.genMockFunction(),
        emptyDomainsTxt: 'bb'
      }
      return shallow(<DomainToolbar {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });

  it('should not show Edit button', () => {
    const button = shallow(<DomainToolbar addNew={true}/>);
    expect(button.find('IsAllowed').hasClass('btn-add-new')).toBe(true)
  });

  it('should show DomainSelector', () => {
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
