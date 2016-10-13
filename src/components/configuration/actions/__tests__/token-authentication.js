import React from 'react'
import { Map } from 'immutable'
import { shallow } from 'enzyme'

jest.dontMock('../token-authentication.jsx')
const TokenAuthentication = require('../token-authentication.jsx')

describe('TokenAuthentication', () => {
  const intlMaker = () => { return { formatMessage: jest.fn() } }
  let changeValue, close
  let component, buttons

  beforeEach(() => {
    changeValue = jest.fn()
    close = jest.fn()

    component = shallow(
      <TokenAuthentication
        changeValue={changeValue}
        close={close}
        set={Map()}
        intl={intlMaker()}
      />
    )

    buttons = component.find('Button')
  })

  it('should exist', () => {
    expect(component).toBeTruthy()
  })

  it('should update internal state as changes happen', () => {
    let inputs = component.find('Input')
    inputs.at(0).simulate('change', {target: {value: 'c2hhcmVkLXNlY3JldA=='}})
    expect(component.state('shared_key')).toEqual('c2hhcmVkLXNlY3JldA==')
    expect(changeValue).not.toHaveBeenCalled()
  })

  it('should discard changes on cancel', () => {
    buttons.at(0).simulate('click')
    expect(changeValue).not.toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })

  it('should save changes and then close', () => {
    buttons.at(1).simulate('click')
    expect(changeValue).toHaveBeenCalled()
    expect(close).toHaveBeenCalled()
  })
})
