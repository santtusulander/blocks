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
  value: 'foo'
})

const fakePath = Immutable.fromJS(['foo', 'bar'])

describe('FileExtension', () => {
  let component, changeValue, activateMatch

  beforeEach(() => {
    changeValue = jest.fn()
    activateMatch = jest.fn()

    component = shallow(
      <FileExtension
        match={fakeConfig}
        changeValue={changeValue}
        activateMatch={activateMatch}
        path={fakePath}
        intl={intlMaker()}
      />
    )
  })

  it('should exist', () => {
    expect(component).toBeDefined()
  })

  it('should call changeValue with valid params', () => {
    component.setState({
      extensions: [{label: 'MP3'}, {label: 'MOV'}, {label: 'GIF'}]
    })
    component.instance().saveChanges()

    expect(changeValue.mock.calls.length).toBe(1)

    const result = {
      type: 'regexp',
      value: '(.*)\\.(MP3|MOV|GIF)',
      inverted: false
    }

    expect(changeValue.mock.calls[0][1].toJS()).toEqual(result)
  })
})
