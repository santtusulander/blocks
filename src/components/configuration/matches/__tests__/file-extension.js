import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

jest.unmock('../file-extension.jsx')
import FileExtension from '../file-extension.jsx'

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('FileExtension', () => {
  it('should exist', () => {
    let fileExtension = shallow(
      <FileExtension match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(fileExtension).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileExtension = shallow(
      <FileExtension changeValue={changeValue} match={fakeConfig}
        path={fakePath} intl={intlMaker()}/>
    )
    let inputs = fileExtension.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let fileExtension = shallow(
      <FileExtension changeValue={changeValue} match={fakeConfig}
        path={fakePath} intl={intlMaker()}/>
    )
    expect(fileExtension.state('activeFilter')).toBe('matches')
    fileExtension.instance().handleSelectChange('activeFilter')('foo')
    expect(fileExtension.state('activeFilter')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
