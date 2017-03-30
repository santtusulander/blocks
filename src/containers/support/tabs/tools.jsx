import React from 'react'

import SupportToolPanel from '../../../components/support/tools/support-tool-panel'
import ModalDig from '../tools/modals/dig.jsx'
import ModalGeoLookup from '../tools/modals/geo-lookup.jsx'
import ModalMtr from '../tools/modals/mtr.jsx'
import ModalServerValidation from '../tools/modals/server-validation.jsx'
import { injectIntl } from 'react-intl'

import IconDig from '../../../components/icons/icon-dig'
import IconBrowse from '../../../components/icons/icon-browse'
import IconMtr from '../../../components/icons/icon-mtr'
import IconServerValidation from '../../../components/icons/icon-server-validation'

import './tools.scss'

class SupportTabTools extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activePanel: null,
      showDigDetails: false,
      showGeoDetails: false,
      showMtrDetails: false,
      showServerValidationDetails: false
    }

    this.closeModal = this.closeModal.bind(this)
    this.setActivePanel = this.setActivePanel.bind(this)
  }

  closeModal() {
    this.setState({
      activePanel: null,
      showDigDetails: false,
      showGeoDetails: false,
      showMtrDetails: false,
      showServerValidationDetails: false
    })
  }

  setActivePanel(panel) {
    return () => {
      this.setState({
        activePanel: panel
      })
    }
  }

  render() {
    return (
      <div className="account-support-tools">

        <div className="support-tools-list">
          <SupportToolPanel
            active={this.state.activePanel === 'dig'}
            onClick={this.setActivePanel('dig')}
            icon={<IconDig className="pale-blue" width={100} height={100}/>}
            body={this.props.intl.formatMessage({id: 'portal.support.tools.dig.panelBody.text'})}
            title={this.props.intl.formatMessage({id: 'portal.support.tools.dig.panelTitle.text'})}/>
          <SupportToolPanel
            active={this.state.activePanel === 'mtr'}
            onClick={this.setActivePanel('mtr')}
            icon={<IconMtr className="pale-blue" width={100} height={100}/>}
            body={this.props.intl.formatMessage({id: 'portal.support.tools.mtr.panelBody.text'})}
            title={this.props.intl.formatMessage({id: 'portal.support.tools.mtr.panelTitle.text'})}/>
          <SupportToolPanel
            active={this.state.activePanel === 'geo-lookup'}
            onClick={this.setActivePanel('geo-lookup')}
            icon={<IconBrowse className="pale-blue" width={100} height={100} />}
            body={this.props.intl.formatMessage({id: 'portal.support.tools.geoLookup.panelBody.text'})}
            title={this.props.intl.formatMessage({id: 'portal.support.tools.geoLookup.panelTitle.text'})}/>
          <SupportToolPanel
            active={this.state.activePanel === 'server-validation'}
            onClick={this.setActivePanel('server-validation')}
            icon={<IconServerValidation className="pale-blue" width={100} height={100} />}
            body={this.props.intl.formatMessage({id: 'portal.support.tools.serverValidation.panelBody.text'})}
            title={this.props.intl.formatMessage({id: 'portal.support.tools.serverValidation.panelTitle.text'})}/>
        </div>

        {this.state.activePanel === 'dig' &&
          <ModalDig
            handleCloseModal={this.closeModal}
            toggleShowDetails={val => this.setState({
              showDigDetails: val
            })}
            showDetails={this.state.showDigDetails}/>
        }

        {this.state.activePanel === 'geo-lookup' &&
          <ModalGeoLookup
            handleCloseModal={this.closeModal}
            toggleShowDetails={val => this.setState({
              showGeoDetails: val
            })}
            showDetails={this.state.showGeoDetails}/>
        }

        {this.state.activePanel === 'mtr' &&
          <ModalMtr
            handleCloseModal={this.closeModal}
            toggleShowDetails={val => this.setState({
              showMtrDetails: val
            })}
            showDetails={this.state.showMtrDetails}/>
        }

        {this.state.activePanel === 'server-validation' &&
          <ModalServerValidation
            handleCloseModal={this.closeModal}
            toggleShowDetails={val => this.setState({
              showServerValidationDetails: val
            })}
            showDetails={this.state.showServerValidationDetails}/>
        }

      </div>
    )
  }
}

SupportTabTools.displayName = 'SupportTabTools'
SupportTabTools.propTypes = {
  intl: React.PropTypes.object
}

export default injectIntl(SupportTabTools);
