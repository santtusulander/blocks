import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../footer.jsx')
import Footer from '../footer.jsx'

describe('Footer', () => {
  it('should exist', () => {
    const footer = shallow(<Footer />)
    expect(footer).toBeDefined()
  });

  it('can be passed a custom css class', () => {
    const footer = shallow(<Footer className="foo" />)
    expect(footer.find('div').get(0).props.className).toContain('foo')
  });
})
