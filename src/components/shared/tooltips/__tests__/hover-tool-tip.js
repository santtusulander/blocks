jest.unmock('../hover-tool-tip.jsx');

import React from 'react';
import { shallow } from 'enzyme'
import HoverToolTip from '../hover-tool-tip.jsx'

describe('HoverToolTip', function() {
  let subject = null
  beforeEach(() => {
    subject = () => {
      let props = {
        linkText:"Link Text"
      }
      return shallow(<HoverToolTip {...props}/>)
    }
  })
  it('should exist', () => {
    expect(subject().length).toBe(1)
  });
});
