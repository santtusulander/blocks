import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Field } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import * as asnActionCreators from '../../redux/modules/asn'
import FieldFormGroupTypeahead from '../form/field-form-group-typeahead'
import { ASN_STARTING_SEARCH_COUNT, ASN_SEARCH_DELAY } from '../../constants/network'
import { formatASN } from '../../util/helpers'


class FieldFormGroupAsnLookup extends Component {
  constructor(props) {
    super(props)

    this.state = {
      options: []
    }

    this.onSearch = this.onSearch.bind(this)
  }

  onSearch(query) {
    if (!query) {
      return;
    }

    const filterType = parseInt(query) ? 'asn' : 'organization'
    this.props.asnActions.fetchAsns({filterBy: filterType, filterValue: query})
      .then(resp => {
        let options = []
        resp.payload.forEach(item => {
          options.push({
            id: item.asn,
            label: formatASN(item)
          })
        })

        this.setState({options: options})
      });
  }

  render() {
    const label = this.props.withoutLabel ? null : <FormattedMessage id="portal.common.typeahead.asnLookup.label"/>

    return (
      <Field
        name={this.props.name || 'AsnLookup'}
        disabled={this.props.disabled}
        className='asn-lookup'
        asyncMode={true}
        useCache={false}
        component={FieldFormGroupTypeahead}
        multiple={true}
        minLength={ASN_STARTING_SEARCH_COUNT}
        delay={ASN_SEARCH_DELAY}
        options={this.state.options}
        label={label}
        placeholder={this.props.intl.formatMessage({id: 'portal.common.typeahead.asnLookup.placeholder'})}
        emptyLabel={this.props.intl.formatMessage({id: 'portal.common.search.no-results.text'})}
        onSearch={this.onSearch} />
    )
  }
}


FieldFormGroupAsnLookup.displayName = 'FieldFormGroupAsnLookup'
FieldFormGroupAsnLookup.propTypes = {
  asnActions: PropTypes.object,
  disabled: PropTypes.bool,
  intl: PropTypes.object,
  name: PropTypes.string,
  withoutLabel: PropTypes.bool
}

function mapDispatchToProps(dispatch) {
  return {
    asnActions: bindActionCreators(asnActionCreators, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(injectIntl(FieldFormGroupAsnLookup))
