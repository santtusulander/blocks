import React from 'react'
import { shallow } from 'enzyme'
import { SidePanelComponent as SidePanel } from '../side-panel.jsx'

jest.unmock('../side-panel.jsx')

describe('SidePanel', () => {
  let sidePanel = null
  beforeEach(() => {
    sidePanel = (props) => {
      let defaultProps = {
        cancel: jest.fn(),
        className:'testing',
        title:'Side Panel'
      }
      let finalProps = Object.assign({}, defaultProps, props)
      return shallow(<SidePanel {...finalProps}/>)
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
})
