import React from 'react'
import { shallow } from 'enzyme'

jest.unmock('../banner-notification')
import { BANNER_NOTIFICATION_NO_LOCAL_STORAGE } from '../banner-notification'
import BannerNotification from '../banner-notification'

describe('BannerNotification', () => {
  it('should exist', () => {
    const notification = shallow(<BannerNotification />)
    expect(notification).toBeDefined()
  })

  it('should display BANNER_NOTIFICATION_NO_LOCAL_STORAGE status when it is required', () => {
    const notification = shallow(
      <BannerNotification notificationCode={BANNER_NOTIFICATION_NO_LOCAL_STORAGE}/>
    )

    expect(notification.find("#container-text").length).toBe(1)
  })

  it('should not display BANNER_NOTIFICATION_NO_LOCAL_STORAGE status when it is not required', () => {
    const notification = shallow(
      <BannerNotification notificationCode={null}/>
    )

    expect(notification.find("#container-text").length).toBe(0)
  })

  it('should display IconInfo when state is BANNER_NOTIFICATION_NO_LOCAL_STORAGE', () => {
    const notification = shallow(
      <BannerNotification notificationCode={BANNER_NOTIFICATION_NO_LOCAL_STORAGE}/>
    )

    expect(notification.find("IconInfo").length).toBe(1)
  })
})
