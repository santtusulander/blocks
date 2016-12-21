import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../export-panel')
import ExportPanel from '../export-panel'

const subject = shallow(<ExportPanel intl={{ formatMessage() {} }} panelTitle="test"/>)

describe('ExportPanel', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })

})
