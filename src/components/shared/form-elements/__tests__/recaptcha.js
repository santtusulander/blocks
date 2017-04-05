import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../recaptcha')
import ReCAPTCHA from '../recaptcha'

const subject = shallow(
  <ReCAPTCHA
    onChange={()=>{}}
    sitekey="foo" />
)

describe('ReCAPTCHA', () => {
 it('should exist', () => {
   expect(subject.length).toBe(1)
 })
})
