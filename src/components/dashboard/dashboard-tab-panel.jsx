import React, { PropTypes, Component, Children } from 'react'
import classNames from 'classnames'
import {Row, Col} from 'react-bootstrap'

import './dashboard-panel.scss'

class DashboardTabPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTab : this.props.defaultTab || ''
    }
  }

  handleClick(label) {
    return () => {
      this.setState({
        activeTab : label
      });
    }
  }
  render(){
    const { className, threeItemPerRow, noPadding, children} = this.props
    const tabs = Children.toArray(children)
    const tabLength = tabs.length ? 12/tabs.length : 12
    const { activeTab } = this.state

    return (
      <div className={classNames(
        'dashboard-panel',
        {
          className,
          threeItemPerRow,
          'no-padding': noPadding
        }
      )}>
        {tabLength &&
          <div className="dashboard-tab-panel-header">
            <Row>
            {tabs.map(({ props : {label}}, index) => (
              <Col xs={tabLength}
                key={index}
                className= {
                  classNames(
                    "header-tab",
                    {"active-tab": activeTab === label}
                  )
                }
                onClick={this.handleClick(label)}>
                <h5>{label}</h5>
              </Col>)
            )}
            </Row>
          </div>
        }

        <div className="dashboard-panel-content">
          {tabs.filter(({ props : {label} }) => label === this.state.activeTab)}
        </div>

      </div>
    )
  }
}

DashboardTabPanel.displayName = "DashboardPanel"
DashboardTabPanel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultTab: PropTypes.string,
  noPadding: PropTypes.bool,
  threeItemPerRow: PropTypes.bool
}

export default DashboardTabPanel
