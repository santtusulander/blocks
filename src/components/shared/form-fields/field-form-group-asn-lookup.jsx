import React, { Component, PropTypes } from 'react'
import { Field } from 'redux-form'
import { injectIntl, FormattedMessage } from 'react-intl'

import axios from 'axios'
import { BASE_URL_NORTH, qsBuilder } from '../../../redux/util'

import FieldFormGroupTypeahead from './field-form-group-typeahead'
import { ASN_STARTING_SEARCH_COUNT, ASN_SEARCH_DELAY, ASN_ITEMS_COUNT_TO_SEARCH } from '../../../constants/network'
import { formatASN } from '../../../util/helpers'

const fetchAsns = (filterBy, filterValue) => {
  const queryParams = qsBuilder({ filter_by: filterBy, filter_value: filterValue, page_size: ASN_ITEMS_COUNT_TO_SEARCH })

  return axios.get(`${BASE_URL_NORTH}/asns${queryParams}`)
    .then((res) => {
      return res ? res.data.data : []
    })
}
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

    fetchAsns(filterType, query)
      .then(asns => {
        const options = asns.map(item => ({
          id: item.asn.toString(),
          label: formatASN(item)
        }))

        this.setState({ options })
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
        multiple={this.props.multiple}
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

FieldFormGroupAsnLookup.defaultProps = { multiple: true }
FieldFormGroupAsnLookup.displayName = 'FieldFormGroupAsnLookup'
FieldFormGroupAsnLookup.propTypes = {
  disabled: PropTypes.bool,
  intl: PropTypes.object,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  withoutLabel: PropTypes.bool
}

export default injectIntl(FieldFormGroupAsnLookup)
