import React from 'react'

import SupportToolPanel from '../../../components/support/tools/support-tool-panel'
import ModalMtr from '../tools/modals/mtr.jsx'
import ModalServerValidation from '../tools/modals/server-validation.jsx'

import IconDig from '../../../components/icons/icon-dig'
import IconContent from '../../../components/icons/icon-content'
import IconMtr from '../../../components/icons/icon-mtr'
import IconServerValidation from '../../../components/icons/icon-server-validation'

import './tools.scss'

class SupportTabTools extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activePanel: null,
      showMtrDetails: false,
      showServerValidationDetails: false
    }

    this.closeModal = this.closeModal.bind(this)
    this.setActivePanel = this.setActivePanel.bind(this)
  }

  closeModal() {
    this.setState({
      activePanel: null,
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
            body="Online Domain Name Server (DNS) query tool to determine nameserver answer for a given hostname"
            title="DIG"/>
          <SupportToolPanel
            active={this.state.activePanel === 'mtr'}
            onClick={this.setActivePanel('mtr')}
            icon={<IconMtr className="pale-blue" width={100} height={100}/>}
            body="Online tool to test network connectivity to determine if there is packet loss along the route"
            title="MTR"/>
          <SupportToolPanel
            active={this.state.activePanel === 'geo-lookup'}
            onClick={this.setActivePanel('geo-lookup')}
            icon={<IconContent className="pale-blue" width={100} height={100} />}
            body="Lookup the network and geographic attributes associated with an IP address"
            title="Geo Lookup"/>
          <SupportToolPanel
            active={this.state.activePanel === 'server-validation'}
            onClick={this.setActivePanel('server-validation')}
            icon={<IconServerValidation className="pale-blue" width={100} height={100} />}
            body="Determine whether or not a particular IP address is from the UDN network"
            title="Server Validation"/>
        </div>

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
}

export default SupportTabTools;
