import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../notification.jsx')
import Notification from '../notification.jsx'

describe('Notification', () => {
  it('should exist', () => {
    const notification = shallow(<Notification />)
    expect(notification).toBeDefined()
  });

  it('can be passed a custom css class', () => {
    const notification = shallow(<Notification className="foo" />)
    expect(notification.find('div').get(0).props.className).toContain('foo')
  });
})
