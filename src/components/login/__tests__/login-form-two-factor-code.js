import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form-two-factor-code.jsx')
import { LoginFormTwoFactorCode } from '../login-form-two-factor-code.jsx'
import { TWO_FA_CODE_INPUT_FIELD_NAMES,
         TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH } from '../../../constants/login.js'

const NUM_OF_CODE_INPUTS = TWO_FA_CODE_INPUT_FIELD_NAMES.length

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const subject = () => {
  const props = {
    onSubmit: jest.fn(),
    onFocus: jest.fn(),
    loginError: '',
    intl: intlMaker(),
    fetching: false
  }

  return (
    <LoginFormTwoFactorCode {...props} />
  )
}

describe('LoginFormTwoFactorCode', () => {
  it('should exist', () => {
    const loginFormCode = shallow(
      subject()
    )
    expect(loginFormCode.length).toBe(1)
  })

  it('should have 7 inputs', () => {
    const loginFormCode = shallow(
      subject()
    )
    expect(loginFormCode.find('FormControl').length).toBe(NUM_OF_CODE_INPUTS)
  })

  it('inputs should have maxLength equals 1', () => {
    const loginFormCode = shallow(
      subject()
    )
    const inputs = loginFormCode.find('FormControl')

    for (let i = 0; i < NUM_OF_CODE_INPUTS; i++)
    {
      expect(inputs.at(i).node.props.maxLength).toBe(1)
    }
  })

  it('inputs should accept char codes < 31', () => {
    let numOfBlockedSymbols = 0;
    const loginFormCode = shallow(
      subject()
    )
    const inputs = loginFormCode.find('FormControl')


    for (let i = 0; i < NUM_OF_CODE_INPUTS; i++)
    {
      inputs.at(0).simulate('keyPress', {keyCode: 31 - i, which: 31 - i, preventDefault: function() {
        numOfBlockedSymbols++
      }})
    }

    expect(numOfBlockedSymbols).toBe(0)
  })

  it('inputs should not accept char codes > 31', () => {
    let numOfBlockedSymbols = 0;
    const loginFormCode = shallow(
      subject()
    )
    const inputs = loginFormCode.find('FormControl')


    for (let i = 0; i < NUM_OF_CODE_INPUTS; i++)
    {
      inputs.at(0).simulate('keyPress', {keyCode: 32 + i, which: 32 + i, preventDefault: function() {
        numOfBlockedSymbols++
      }})
    }

    expect(numOfBlockedSymbols).toBe(NUM_OF_CODE_INPUTS)
  })
})
