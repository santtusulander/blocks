import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form-two-factor-code.jsx')
import { LoginFormTwoFactorCode } from '../login-form-two-factor-code.jsx'
import { TWO_FA_CODE_INPUT_FIELD_NAMES,
         TWO_FA_CODE_INPUT_FIELD_MAX_LENGTH } from '../../../constants/login.js'

const NUM_OF_CODE_INPUTS = TWO_FA_CODE_INPUT_FIELD_NAMES.length

const subject = (loginErrorStr = '', fetching = false) => {
  const props = {
    onSubmit: jest.fn(),
    onFocus: jest.fn(),
    loginError: loginErrorStr,
    fetching: fetching
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

  describe('inputs validation', () => {
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
        inputs.at(i).simulate('keyPress', {keyCode: 31 - i, which: 31 - i, preventDefault: function() {
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
        inputs.at(i).simulate('keyPress', {keyCode: 32 + i, which: 32 + i, preventDefault: function() {
          numOfBlockedSymbols++
        }})
      }

      expect(numOfBlockedSymbols).toBe(NUM_OF_CODE_INPUTS)
    })
  })

  describe('error handling', () => {
    it('should not show error message without login error', () => {
      const loginFormCode = shallow(
        subject()
      )
      expect(loginFormCode.find('.token-input-info').text()).not.toContain('Test error')
    })

    it('should show error message on login error', () => {
      const loginFormCode = shallow(
        subject('Test error')
      )
      expect(loginFormCode.find('.token-input-info').text()).toContain('Test error')
    })
  })

  describe('fetching data handling', () => {
    it('should show a small loading spinner when fetching data', () => {
      const loginFormCode = shallow(
        subject('', true)
      )
      expect(loginFormCode.find('LoadingSpinnerSmall').length).toBe(1)
    })

    it('should hide HaveTrouble button when fetching data', () => {
      const loginFormCode = shallow(
        subject('', true)
      )
      expect(loginFormCode.find('.having-trouble-link').length).toBe(0)
    })

    it('should not show a small loading spinner when fetching data op. has been completed', () => {
      const loginFormCode = shallow(
        subject()
      )
      expect(loginFormCode.find('LoadingSpinnerSmall').length).toBe(0)
    })

    it('should show HaveTrouble button when fetching data op. has been completed', () => {
      const loginFormCode = shallow(
        subject()
      )
      expect(loginFormCode.find('.having-trouble-link').length).toBe(1)
    })
  })
})
