import React from 'react'
import { shallow } from 'enzyme'
import SidePanel from '../side-panel.jsx'

jest.unmock('../side-panel.jsx')
jest.unmock('react-addons-css-transition-group')
jest.unmock('../../decorators/key-stroke-decorator')
jest.unmock('../../components/notification')

describe('SidePanel', () => {
  let sidePanel = null
  beforeEach(() => {
    sidePanel = (props) => {
      let defaultProps = {
        store: {},
        cancel: jest.fn(),
        dim: false,
        show: true,
        className:'testing',
        title:'Side Panel',
        notification: '',
        uiActions: {changeSidePanelNotification: jest.fn()}
      }
      let finalProps = Object.assign({}, defaultProps, props)
      return shallow(<SidePanel {...finalProps} />).shallow()
    }
  })

  it('should exist', () => {
    expect(sidePanel().length).toBe(1)
  });

  it('should not show empty subTitle', () => {
    expect(sidePanel().find('p').length).toBe(0)
  });

  it('should not show empty subSubTitle', () => {
    expect(sidePanel().find('.sub-title-two-line').length).toBe(0)
  });

  it('should show subTitle', () => {
    expect(sidePanel({subTitle: "subTitle"}).find('p').text()).toBe("subTitle")
  });

  it('should show subSubTitle', () => {
    expect(sidePanel({subTitle: "subTitle", subSubTitle: "subSubTitle"}).find('.sub-sub-title').text()).toBe("subSubTitle")
  });

  it('should show subTitle when subSubTitle is present', () => {
    expect(sidePanel({subTitle: "subTitle", subSubTitle: "subSubTitle"}).find('.sub-title').text()).toBe("subTitle")
  });

  it('should not show subSubTitle without subSubTitle', () => {
    expect(sidePanel({subSubTitle: "subSubTitle"}).find('.sub-title-two-line').length).toBe(0)
  });

  it('should not show notification when it is not required', () => {
    expect(sidePanel().find('Notification').length).toBe(0)
  });

  it('should show notification when it is required', () => {
    expect(sidePanel({notification: 'test'}).find('Notification').length).toBe(1)
  });
})
