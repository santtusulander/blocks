import React from 'react'

import SupportToolPanel from '../../../components/support/tools/support-tool-panel'
import IconDig from '../../../components/icons/icon-dig'
import IconContent from '../../../components/icons/icon-content'
import IconMtr from '../../../components/icons/icon-mtr'
import IconServerValidation from '../../../components/icons/icon-server-validation'

import './tools.scss'

class SupportTabTools extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activePanel: null
    }

    this.resetActivePanel = this.resetActivePanel.bind(this)
    this.setActivePanel = this.setActivePanel.bind(this)
  }

  resetActivePanel() {
    this.setState({
      activePanel: null
    })
  }

  setActivePanel(panel) {
    // TODO: Attach modal open functions here once the side panels are done
    this.setState({
      activePanel: panel
    })
  }

  render() {
    return (
      <div className="account-support-tools">
        <div className="support-tools-list">
          <SupportToolPanel
            active={this.state.activePanel}
            onClick={this.setActivePanel}
            icon={<IconDig className="pale-blue" width={100} height={100}/>}
            body="Online Domain Name Server (DNS) query tool to determine nameserver answer for a given hostname"
            title="DIG"/>
          <SupportToolPanel
            active={this.state.activePanel}
            onClick={this.setActivePanel}
            icon={<IconMtr className="pale-blue" width={100} height={100}/>}
            body="Online tool to test network connectivity to determine if there is packet loss along the route"
            title="MTR"/>
          <SupportToolPanel
            active={this.state.activePanel}
            onClick={this.setActivePanel}
            icon={<IconContent className="pale-blue" width={100} height={100} />}
            body="Lookup the network and geographic attributes associated with an IP address"
            title="Geo Lookup"/>
          <SupportToolPanel
            active={this.state.activePanel}
            onClick={this.setActivePanel}
            icon={<IconServerValidation className="pale-blue" width={100} height={100} />}
            body="Determine whether or not a particular IP address is from the UDN network"
            title="Server Validation"/>
        </div>
      </div>
    )
  }
}

SupportTabTools.displayName = 'SupportTabTools'
SupportTabTools.propTypes = {
}

export default SupportTabTools;
