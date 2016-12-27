import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../login-form.jsx')
import { LoginForm } from '../login-form.jsx'

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

const onSubmit = jest.fn().mockImplementation(() => {
  return {then: cb => cb()}
})

const subject = (loginErrorStr = '') => {
  const props = {
    userName: '',
    onSubmit: onSubmit,
    sessionExpired: false,
    loginError: loginErrorStr,
    fetching: false,
    intl: intlMaker(),
    location: {query: {}}
  }

  return (
    <LoginForm {...props} />
  )
}

describe('LoginForm', () => {
  it('should exist', () => {
    const loginForm = shallow(
      subject()
    )
    expect(loginForm.length).toBe(1)
  })

  it('toggles username remember', () => {
    const loginForm = shallow(
      subject()
    )
    const checkbox = loginForm.find('Checkbox')
    expect(loginForm.state('rememberUsername')).toBe(false)
    checkbox.simulate('change')
    expect(loginForm.state('rememberUsername')).toBe(true)
  })

  it('should have 2 inputs', () => {
    const loginForm = shallow(
      subject()
    )
    expect(loginForm.find('FormControl').length).toBe(2)
  })

  it('maintains form state', () => {
    const loginForm = shallow(
      subject()
    )
    const inputs = loginForm.find('FormControl')
    inputs.at(0).simulate('change', {target: {value: 'aaa'}})
    inputs.at(1).simulate('change', {target: {value: 'bbb'}})
    expect(loginForm.state('username')).toBe('aaa')
    expect(loginForm.state('password')).toBe('bbb')
  })

  it('toggles active class when focused and blurred', () => {
    const loginForm = shallow(
      subject()
    )
    const inputs = loginForm.find('FormControl')

    const usernameHolder = inputs.at(0)
    expect(loginForm.state('usernameActive')).toBe(false)
    usernameHolder.simulate('focus')
    expect(loginForm.state('usernameActive')).toBe(true)
    usernameHolder.simulate('blur')
    expect(loginForm.state('usernameActive')).toBe(false)

    expect(loginForm.state('passwordActive')).toBe(false)
    inputs.at(1).simulate('focus')
    expect(loginForm.state('passwordActive')).toBe(true)
    inputs.at(1).simulate('blur')
    expect(loginForm.state('passwordActive')).toBe(false)
  })

  it('handles a failed log in attempt', () => {
    const loginForm = shallow(
      subject('Test fail')
    )

    loginForm.setState({username: 'aaa', password: 'bbb'})
    const form = loginForm.find('form')

    form.simulate('submit', { preventDefault: () => {/* noop */} })
    expect(onSubmit.mock.calls[0][0]).toBe('aaa')
    expect(onSubmit.mock.calls[0][1]).toBe('bbb')

    const errorMsg = loginForm.find('.login-info')
    expect(errorMsg.text()).toContain('Test fail')
  })

  it('handles a successful log in attempt', () => {
    const loginForm = shallow(
      subject()
    )

    loginForm.setState({username: 'aaa', password: 'bbb', rememberUsername: true})
    const form = loginForm.find('form')
    form.simulate('submit', { preventDefault: () => {/* noop */} })
    expect(onSubmit.mock.calls[0][0]).toBe('aaa')
    expect(onSubmit.mock.calls[0][1]).toBe('bbb')
  })
})
