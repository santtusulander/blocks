import React, { PropTypes, Component } from 'react'
import classNames from 'classnames'
import {Row, Col, Tab} from 'react-bootstrap'

import './dashboard-panel.scss'

class DashboardTabPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openedTabID : ""
    }
  }
  getContentComponent(){

  }
  render(){
    const { className, threeItemPerRow, noPadding, tabs} = this.props
    const tabLength = tabs.length ? 12/tabs.length : 12
    return (
      <div className={classNames(
        'dashboard-panel',
        {
          className,
          threeItemPerRow,
          'no-padding': noPadding
        }
      )}>
        {tabs &&
          <div className="dashboard-tab-panel-header">
            <Row>
            {tabs.map(tab => (
              <Col xs={tabLength} className="header-tab" eventKey={tab}>
                <h5>{tab}</h5>
              </Col>)
            )}
            </Row>
          </div>
        }
        <div className="dashboard-panel-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

DashboardTabPanel.displayName = "DashboardPanel"
DashboardTabPanel.propTypes = {
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  tabs: PropTypes.array,
  threeItemPerRow: PropTypes.bool
}

export default DashboardTabPanel
