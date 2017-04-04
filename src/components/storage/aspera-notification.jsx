import React from 'react'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { AW4, ASPERA_TROUBLESHOOT_URL, ASPERA_DOWNLOAD_URL } from '../../util/aspera-helpers'
import { Button, ButtonToolbar } from 'react-bootstrap'

import IconInfo from '../../components/shared/icons/icon-info'
import IconTask from '../../components/shared/icons/icon-task'
import LoadingSpinnerSmall from '../../components/loading-spinner/loading-spinner-sm'

export const ASPERA_STATUS_TRANSFER_ERROR = 'ASPERA_STATUS_TRANSFER_ERROR'
export const ASPERA_STATUS_ACCESS_CODE_ERROR = 'ASPERA_STATUS_ACCESS_CODE_ERROR'

class AsperaNotification extends React.Component {
  constructor(props) {
    super(props)

    this.renderNotification = this.renderNotification.bind(this)
  }

  renderNotification() {
    switch (this.props.status) {

      case ASPERA_STATUS_TRANSFER_ERROR:
        return (
          <div>
            <span id="update-container-text" className="text">
              <IconInfo />
              <FormattedMessage id="portal.aspera.error.transfer"
                                values={{
                                  troubleshoot: (
                                    <Link to={ASPERA_TROUBLESHOOT_URL} target="_blank">
                                      <FormattedMessage id="portal.aspera.connect.installer.troubleshoot"/>
                                    </Link>
                                  )
                                }}/>
            </span>
          </div>
        )

      case ASPERA_STATUS_ACCESS_CODE_ERROR:
        return (
          <div>
            <span id="download-container-text" className="text">
              <IconInfo />
              <FormattedMessage id="portal.aspera.error.access_code"/>
            </span>
            <div className="pull-right">
              <ButtonToolbar>
                {/* Using hard reload to reset Aspera */}
                <a href={window.location.pathname} className="download-btn">
                  <Button className="btn-secondary">
                      <FormattedMessage id="portal.aspera.connect.installer.try_again"/>
                  </Button>
                </a>
              </ButtonToolbar>
            </div>
          </div>
        )

      case AW4.Connect.STATUS.INITIALIZING:
        return (
          <div>
            <span id="launching-container-text" className="text">
              <LoadingSpinnerSmall />
              <FormattedMessage id="portal.aspera.connect.installer.init"/>
            </span>
          </div>
        )

      case AW4.Connect.STATUS.FAILED:
        return (
          <div>
            <span id="download-container-text" className="text">
              <IconInfo />
              <FormattedMessage id="portal.aspera.connect.installer.fail"
                                values={{
                                  troubleshoot: (
                                    <Link to={ASPERA_TROUBLESHOOT_URL} target="_blank">
                                      <FormattedMessage id="portal.aspera.connect.installer.troubleshoot"/>
                                    </Link>
                                  )
                                }}/>
            </span>
            <div className="pull-right">
              <ButtonToolbar>
                <Button className="btn-secondary" onClick={this.props.handleClose}>
                  <FormattedMessage id="portal.aspera.connect.installer.cancel"/>
                </Button>
                <Link to={ASPERA_DOWNLOAD_URL} className="download-btn" target="_blank">
                  <Button className="btn-secondary">
                      <FormattedMessage id="portal.aspera.connect.installer.download"/>
                  </Button>
                </Link>
              </ButtonToolbar>
            </div>
          </div>
        )

      case AW4.Connect.STATUS.OUTDATED:
        return (
          <div>
            <span id="update-container-text" className="text">
              <IconInfo />
              <FormattedMessage id="portal.aspera.connect.installer.outdated"/>
            </span>
            <div className="pull-right">
              <ButtonToolbar>
                <Button className="btn-secondary" onClick={this.props.handleClose}>
                  <FormattedMessage id="portal.aspera.connect.installer.cancel"/>
                </Button>
                <Link to={ASPERA_DOWNLOAD_URL} className="download-btn" target="_blank">
                  <Button className="btn-secondary">
                      <FormattedMessage id="portal.aspera.connect.installer.download"/>
                  </Button>
                </Link>
              </ButtonToolbar>
            </div>
          </div>
        )

      case AW4.Connect.STATUS.RUNNING:
        return (
          <div>
            <span id="running-container-text" className="text">
              <IconTask />
              <FormattedMessage id="portal.aspera.connect.installer.running"/>
            </span>
          </div>
        )

      default:
        return null
    }
  }

  render() {
    return (
      <div className="aspera-container">
        <div className="connect-status-banner">
          <div className="connect-status-banner-container">
            <div className="message">
              {this.renderNotification()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AsperaNotification.displayName = 'AsperaNotification'
AsperaNotification.propTypes = {
  handleClose: React.PropTypes.func,
  status: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
}

export default AsperaNotification
