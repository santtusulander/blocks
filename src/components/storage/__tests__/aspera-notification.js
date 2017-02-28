import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../aspera-notification')
import AsperaNotification from '../aspera-notification'

const AW4 = {
  Connect: {
    STATUS: {
      INITIALIZING: 1,
      FAILED: 2,
      OUTDATED: 3,
      RUNNING: 4,
      WRONG: 5
    }
  }
}

describe('AsperaNotification', () => {
  it('should exist', () => {
    const notification = shallow(<AsperaNotification />)
    expect(notification).toBeDefined()
  })

  it('should display INITIALIZING status when it is required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.INITIALIZING
      }/>
    )

    expect(notification.find("#launching-container-text").length).toBe(1)
  })

  it('should display loading-spinner when state is INITIALIZING', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.INITIALIZING
      }/>
    )

    expect(notification.find("LoadingSpinnerSmall").length).toBe(1)
  })

  it('should not display INITIALIZING status when it is not required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("#launching-container-text").length).toBe(0)
  })

  it('should not display loading-spinner when state is not INITIALIZING', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("LoadingSpinnerSmall").length).toBe(0)
  })

  it('should display FAILED status when it is required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.FAILED
      }/>
    )

    expect(notification.find("#download-container-text").length).toBe(1)
  })

  it('should display two button when status is FAILED', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.FAILED
      }/>
    )

    expect(notification.find("Button").length).toBe(2)
  })

  it('should display IconInfo when status is FAILED', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.FAILED
      }/>
    )

    expect(notification.find("IconInfo").length).toBe(1)
  })

  it('should not display FAILED status when it is not required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("#download-container-text").length).toBe(0)
  })

  it('should display OUTDATED status when it is required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.OUTDATED
      }/>
    )

    expect(notification.find("#update-container-text").length).toBe(1)
  })

  it('should display IconInfo when state is OUTDATED', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.OUTDATED
      }/>
    )

    expect(notification.find("IconInfo").length).toBe(1)
  })

  it('should display two button when status is OUTDATED', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.OUTDATED
      }/>
    )

    expect(notification.find("Button").length).toBe(2)
  })

  it('should not display OUTDATED status when it is not required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("#update-container-text").length).toBe(0)
  })

  it('should not display IconInfo when state is not OUTDATED', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("IconInfo").length).toBe(0)
  })

  it('should display RUNNING status when it is required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.RUNNING
      }/>
    )

    expect(notification.find("#running-container-text").length).toBe(1)
  })

  it('should display IconTask when state is RUNNING', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.RUNNING
      }/>
    )

    expect(notification.find("IconTask").length).toBe(1)
  })

  it('should not display RUNNING status when it is not required', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("#running-container-text").length).toBe(0)
  })

  it('should not display IconTask when state is not RUNNING', () => {
    const notification = shallow(
      <AsperaNotification status={
        AW4.Connect.STATUS.WRONG
      }/>
    )

    expect(notification.find("IconTask").length).toBe(0)
  })
})
