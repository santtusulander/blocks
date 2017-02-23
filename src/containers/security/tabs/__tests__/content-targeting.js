import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../content-targeting.jsx');
import TabContentTargeting from '../content-targeting.jsx'

describe('TabContentTargeting', function() {
  let error, subject, props = null

  beforeEach(() => {
    subject = () => {
      props = {}
      return shallow(<TabContentTargeting {...props} />)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })
})
