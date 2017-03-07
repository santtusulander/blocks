import React from 'react'
import { shallow } from 'enzyme'
import Immutable from 'immutable'

jest.unmock('../details.jsx')
import ConfigurationDetails from '../details.jsx'

const intlMaker = () => {
  return {
    formatMessage: jest.fn()
  }
}

describe('ConfigurationDetails', () => {
  it('should exist', () => {
    let details = shallow(
      <ConfigurationDetails />
    );
    expect(details).toBeDefined()
  });

  it('should change values', () => {
    const changeValue = jest.genMockFunction()
    let details = shallow(
      <ConfigurationDetails
        intl={intlMaker()}
        changeValue={changeValue}
        edgeConfiguration={Immutable.fromJS({
          published_name: "aaa",
          origin_host_name: "bbb",
          origin_host_port: 111,
          host_header: "origin_host_name",
          origin_path_append: "ddd"
        })}/>
    );
    let inputs = details.find('FormControl')
    inputs.at(0).simulate('change', { target: { value: "new" } })
    expect(changeValue.mock.calls[0][0]).toEqual(
      ['edge_configuration', 'origin_host_name']
    )
    expect(changeValue.mock.calls[0][1]).toBe("new")
  });

  it('should save changes', () => {
    const saveChanges = jest.genMockFunction()
    let details = shallow(
      <ConfigurationDetails
        intl={intlMaker()}
        saveChanges={saveChanges}
        edgeConfiguration={Immutable.fromJS({
          published_name: "aaa",
          origin_host_name: "bbb",
          origin_host_port: 111,
          host_header: "origin_host_name",
          origin_path_append: "ddd"
        })}/>
    );
    let form = details.find('form');
    form.simulate('submit', { preventDefault: jest.fn() })
    expect(saveChanges.mock.calls.length).toBe(1)
  });
})
