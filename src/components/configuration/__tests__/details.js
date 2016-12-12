import React from 'react'
import TestUtils from 'react-addons-test-utils'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../details.jsx')
import ConfigurationDetails from '../details.jsx'

describe('ConfigurationDetails', () => {
  it('should exist', () => {
    let details = shallow(
      <ConfigurationDetails />
    );
    expect(details).toBeTruthy();
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let details = TestUtils.renderIntoDocument(
      <ConfigurationDetails changeValue={changeValue}
        edgeConfiguration={Immutable.fromJS({
          published_name: "aaa",
          origin_host_name: "bbb",
          origin_host_port: 111,
          host_header: "origin_host_name",
          origin_path_append: "ddd"
        })}/>
    );
    let inputs = TestUtils.scryRenderedDOMComponentsWithTag(details, 'input');
    inputs[0].value = "new"
    TestUtils.Simulate.change(inputs[0])
    expect(changeValue.mock.calls[0][0]).toEqual(
      ['edge_configuration', 'origin_host_name']
    )
    expect(changeValue.mock.calls[0][1]).toBe('new')
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let details = TestUtils.renderIntoDocument(
      <ConfigurationDetails saveChanges={saveChanges}
        edgeConfiguration={Immutable.fromJS({
          published_name: "aaa",
          origin_host_name: "bbb",
          origin_host_port: 111,
          host_header: "origin_host_name",
          origin_path_append: "ddd"
        })}/>
    );
    let form = TestUtils.findRenderedDOMComponentWithTag(details, 'form');
    TestUtils.Simulate.submit(form)
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
