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

const fakePath = Immutable.fromJS(['foo', 'bar'])

describe('FileExtension', () => {
  it('should exist', () => {
    let fileExtension = shallow(
      <FileExtension match={fakeConfig} path={fakePath} intl={intlMaker()}/>
    );
    expect(fileExtension).toBeDefined();
  })
})
