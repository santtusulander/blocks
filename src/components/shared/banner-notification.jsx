import React from 'react'
import { FormattedMessage } from 'react-intl'
import IconProblem from '../../components/shared/icons/icon-problem'

export const BANNER_NOTIFICATION_NO_LOCAL_STORAGE = 'BANNER_NOTIFICATION_NO_LOCAL_STORAGE'

class BannerNotification extends React.Component {
  constructor(props) {
    super(props)

    this.renderNotification = this.renderNotification.bind(this)
  }

  renderNotification() {
    switch (this.props.notificationCode) {
      case BANNER_NOTIFICATION_NO_LOCAL_STORAGE:
        return (
          <div>
            <span id="container-text" className="text">
              <IconProblem />
              <FormattedMessage id="portal.login.localStorage.error.text"/>
            </span>
          </div>
        )

      default:
        return null
    }
  }

  render() {
    return (
      <div className="banner-notification-container">
        <div className="banner-notification-status">
          <div className="message">
            {this.renderNotification()}
          </div>
        </div>
      </div>
    )
  }
}

BannerNotification.displayName = 'BannerNotification'
BannerNotification.propTypes = {
  notificationCode: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
}

export default BannerNotification
