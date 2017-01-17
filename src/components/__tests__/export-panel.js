import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../export-panel')
import ExportPanel from '../export-panel'

const subject = shallow(
  <ExportPanel
    intl={{ formatMessage: () => { return "test" } }}
    panelTitle="test"
    onCancel={jest.fn()}
    onDownload={jest.fn()}
    onSend={jest.fn()}
    exportType="export_email"
  />
)

describe('ExportPanel', () => {
  it('should exist', () => {
    expect(subject.length).toBe(1)
  })

})
