import React from 'react'
import { Row, Col } from 'react-bootstrap'
import Immutable from 'immutable'

import Toggle from '../toggle'
import Select from '../select'

import { FormattedMessage } from 'react-intl'

const securityPath = Immutable.List(['edge_configuration'])
const securityPaths = {
  enabled_edge_ssl: securityPath.push('enabled_edge_ssl'),
  enabled_origin_ssl: securityPath.push('enabled_origin_ssl'),
  enabled_midgress_ssl: securityPath.push('enabled_midgress_ssl'),
  ssl_certificate_id: securityPath.push('ssl_certificate_id')
}

class ConfigurationSecurity extends React.Component {
  constructor(props) {
    super(props)

    this.toggleHTTPS = this.toggleHTTPS.bind(this)
    this.setSSLCertificate = this.setSSLCertificate.bind(this)
  }

  toggleHTTPS() {
    return enabled => {
      const { changeValues } = this.props

      changeValues([
        [securityPaths.enabled_edge_ssl, enabled],
        [securityPaths.enabled_origin_ssl, enabled],
        [securityPaths.enabled_midgress_ssl, enabled],
        [securityPaths.ssl_certificate_id, ""]
      ])
    }
  }

  setSSLCertificate() {
    return certificateId => {
      const { changeValue } = this.props

      changeValue(securityPaths.ssl_certificate_id, certificateId)
    }
  }

  render() {
    const {
      config,
      sslCertificates,
      readOnly
    } = this.props

    const sslEnabled =
      config.getIn(securityPaths.enabled_edge_ssl) === true &&
      config.getIn(securityPaths.enabled_origin_ssl) === true &&
      config.getIn(securityPaths.enabled_midgress_ssl) === true

    const sslCertificateId = config.getIn(securityPaths.ssl_certificate_id)
    const sslCertificateOptionsMapping = option => Immutable.fromJS({ value: option.get('cn'), label: option.get('title') })
    const sslCertificateOptions = sslCertificates.map(sslCertificateOptionsMapping).toJS()

    return (
      <div className="configuration-security">
        <h3><FormattedMessage id="portal.policy.edit.security.text"/></h3>
        <Row className="form-group">
          <Col xs={3} className="toggle-label">
            <FormattedMessage id="portal.configuration.security.enable.text"/>
          </Col>
          <Col xs={9}>
            <Toggle
              readonly={readOnly}
              value={sslEnabled}
              changeValue={this.toggleHTTPS()}
            />
          </Col>
        </Row>
        {sslEnabled === true &&
          <Row className="form-group">
            <Col xs={3} className="toggle-label">
              <FormattedMessage id="portal.configuration.security.sslCertificate.text"/>
            </Col>
            <Col xs={4}>
              <Select className="input-select"
                disabled={readOnly}
                onSelect={this.setSSLCertificate()}
                value={sslCertificateId}
                options={sslCertificateOptions}/>
            </Col>
          </Row>}
      </div>
    )
  }
}

ConfigurationSecurity.displayName = 'ConfigurationSecurity'
ConfigurationSecurity.propTypes = {
  changeValue: React.PropTypes.func,
  changeValues: React.PropTypes.func,
  config: React.PropTypes.instanceOf(Immutable.Map),
  readOnly: React.PropTypes.bool,
  sslCertificates: React.PropTypes.instanceOf(Immutable.List)
}

export default ConfigurationSecurity
