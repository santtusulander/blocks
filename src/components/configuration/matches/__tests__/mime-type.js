import React from 'react'
import Immutable from 'immutable'
import { shallow } from 'enzyme'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

jest.dontMock('../mime-type.jsx')
const MimeType = require('../mime-type.jsx')

const fakeConfig = Immutable.fromJS({
  "cases": [["foo"]]
})

const fakePath = ['foo', 'bar']

describe('MimeType', () => {
  it('should exist', () => {
    let mimeType = shallow(
      <MimeType match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(mimeType).toBeDefined();
  })

  it('should update the parameters as changes happen', () => {
    let changeValue = jest.fn()
    let mimeType = shallow(
      <MimeType changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    let inputs = mimeType.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'new'}})
    expect(changeValue.mock.calls[0][0]).toEqual(['foo', 'bar', 'cases', 0, 0])
    expect(changeValue.mock.calls[0][1]).toEqual('new')
  })

  it('should update the parameters as select change happens', () => {
    let changeValue = jest.fn()
    let mimeType = shallow(
      <MimeType changeValue={changeValue} match={fakeConfig} path={fakePath}
        intl={intlMaker()}/>
    )
    expect(mimeType.state('activeFilter')).toBe('matches')
    mimeType.instance().handleSelectChange('activeFilter')('foo')
    expect(mimeType.state('activeFilter')).toBe('foo')
    expect(changeValue.mock.calls[0][1]).toBe('foo')
  })
})
