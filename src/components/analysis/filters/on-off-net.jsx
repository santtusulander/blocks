import React from 'react'
import { Input } from 'react-bootstrap'

export class FilterOnOffNet extends React.Component {
  render() {
    return (
      <div>
        <div className="sidebar-section-header">
          On-Net/Off-Net
        </div>
        <div className="sidebar-content">
          <Input type="checkbox" label="On-Net"/>
          <Input type="checkbox" label="Off-Net"/>
        </div>
      </div>
    );
  }
}

FilterOnOffNet.displayName = 'FilterOnOffNet'
FilterOnOffNet.propTypes = {}

module.exports = FilterOnOffNet
