import React from 'react'
import { shallow } from 'enzyme'
import SidePanel from '../side-panel.jsx'

jest.unmock('../side-panel.jsx')

describe('SidePanel', () => {
  let sidePanel = null
  beforeEach(() => {
    sidePanel = (account, cancel, cancelButton, children, invalid, show, submit, submitButton, subTitle, title) => {
      let props = {
        account,
        cancel,
        cancelButton,
        children,
        invalid,
        show,
        submit,
        submitButton,
        subTitle:"Testing Side Panel Component",
        title:"Side Panel"
      }
      return shallow(<SidePanel {...props}/>)
    }
  })
  it('should exist', () => {
    expect(sidePanel().length).toBe(1)
  });
})
