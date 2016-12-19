import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

jest.unmock('../file-name.jsx')
import FileName from '../file-name.jsx'

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('FileName', () => {
  it('should exist', () => {
    let fileName = shallow(
      <FileName match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(fileName).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.genMockFunction()
    let fileName = shallow(
      <FileName changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    let inputs = fileName.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.genMockFunction()
    let fileName = shallow(
      <FileName changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    expect(fileName.state('activeFilter')).toBe('matches')
    fileName.instance().handleSelectChange('activeFilter')('foo')
    expect(fileName.state('activeFilter')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
