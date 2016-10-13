import React from 'react'
import { shallow } from 'enzyme'

jest.dontMock('../publish-version.jsx')
const ConfigurationPublishVersion = require('../publish-version.jsx')

function intlMaker() {
  return {
    formatMessage: jest.fn()
  }
}

describe('ConfigurationPublishVersion', () => {
  it('should exist', () => {
    const publish = shallow(<ConfigurationPublishVersion intl={intlMaker()} />)
    expect(publish).toBeDefined()
  })

  it('should not save changes if no publish target is defined', () => {
    const saveChanges = jest.fn()
    const publish = shallow(
      <ConfigurationPublishVersion intl={intlMaker()}
        saveChanges={saveChanges}/>
    )
    const btn = publish.find('.save-btn')
    btn.simulate('click', {preventDefault: () => { /* noop */ }})
    expect(saveChanges.mock.calls.length).toEqual(0)
  })

  it('should save changes if publish target is defined', () => {
    const saveChanges = jest.fn()
    const publish = shallow(
      <ConfigurationPublishVersion intl={intlMaker()}
        saveChanges={saveChanges}/>
    )
    publish.instance().setPublishTarget('2')()
    const btn = publish.find('.save-btn')
    btn.simulate('click', {preventDefault: () => { /* noop */ }})
    expect(saveChanges.mock.calls.length).toEqual(1)
  })
})
