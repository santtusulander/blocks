import React from 'react'
import TestUtils from 'react-addons-test-utils'
import { shallow, mount } from 'enzyme';
import { Map } from 'immutable'

jest.unmock('../services.jsx')
import Services from '../services.jsx'

describe('Services', () => {
  it('should exist', () => {
    let wrapper = shallow(<Services activeAccount={Map()} />)
    expect(TestUtils.isCompositeComponent(wrapper)).toBeTruthy();
  });
})
