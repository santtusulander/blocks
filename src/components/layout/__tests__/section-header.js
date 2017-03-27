import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../section-header')
import SectionHeader from '../section-header'

describe('SectionHeader', () => {
  let subject, error, props = null

  beforeEach(() => {
    subject = (addonBefore = null, addonAfter = null) => {
      props = {
        className: 'foo',
        addonBefore: addonBefore,
        addonAfter: addonAfter
      }
      return shallow(<SectionHeader {...props}/>)
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should display addonBefore when passed', () => {
    expect(subject((<div id="addonBefore"></div>)).find("#addonBefore").length).toBe(1)
  })

  it('should not display addonBefore when it is not passed', () => {
    expect(subject().find("#addonBefore").length).toBe(0)
  })

  it('should display addonAfter when passed', () => {
    expect(subject(null, (<div id="addonAfter"></div>)).find("#addonAfter").length).toBe(1)
  })

  it('should not display addonBefore when it is not passed', () => {
    expect(subject().find("#addonBefore").length).toBe(0)
  })
})
