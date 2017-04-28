import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../sidebar.jsx')
import Sidebar from '../sidebar.jsx'

describe('Sidebar', () => {
  it('should exist', () => {
    expect(shallow(<Sidebar />).length).toBeTruthy();
  });
});
