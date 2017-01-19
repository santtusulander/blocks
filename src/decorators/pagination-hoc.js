import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

import paginationSelector from '../redux/modules/pagination/pagination-selectors'
import { setActivePage, resetPaginationState, setTotal, setSorting, setFilter } from '../redux/modules/pagination/actions'

export default function withPagination(WrappedComponent) {
  class WithPagination extends Component {
    /**
     * Get count of pages
     * @param {number} total - total number of items
     * @param {number} page_size - items per page
     * @returns {number}
     */
    static getPagesCount(total, page_size) {
      return Math.ceil(total/page_size)
    }

    /**
     * Get pagination config object composed from props
     * @param props {Object}
     * @returns {Object}
     */
    static getPagingConfig(props) {
      const { pagingQueryParams, pagingTotal, onSelect } = props;
      const items = this.getPagesCount(pagingTotal, pagingQueryParams.page_size);

      const pagingConfig = {
        onSelect,
        items
      };

      return { pagingConfig };
    }

    constructor(props) {
      super(props);

      this.updatePagingTotalFromResponse = this.updatePagingTotalFromResponse.bind(this);
    }

    /**
     * Do clean-up when component unmounted
     */
    componentWillUnmount() {
      this.props.resetPaginationState();
    }

    /**
     * Determinate if pagination params has been changed.
     * Useful in  React life-hook 'componentWillReceiveProps'.
     * @param currentParams {object} - object referenced to this.props
     * @param nextParams {object} - object referenced to nextProps in life-hook
     * @returns {boolean}
     */
    hasPagingParamsChanged(currentParams, nextParams) {
      return !fromJS(currentParams).equals(fromJS(nextParams))
    }

    /**
     * Get total from response and update if differ from current total
     * @param response {object} - api response
     * @returns {object} - api response
     */
    updatePagingTotalFromResponse(response) {
      const total = fromJS(response).getIn(['payload', 'total'], null);

      if (total !== null && total !== this.props.pagingTotal) {
        this.props.setTotal(total);
      }

      return response;
    }

    render() {

      const pagingConfig = WithPagination.getPagingConfig(this.props);

      const updatePagingTotal = this.updatePagingTotalFromResponse;

      const hasPagingParamsChanged = this.hasPagingParamsChanged;

      return (
        <WrappedComponent
          {...this.props}
          {...pagingConfig}
          {...{updatePagingTotal}}
          {...{hasPagingParamsChanged}}
        />
      );
    }
  }

  WithPagination.displayName = 'WithPagination';
  WithPagination.propTypes = {
    onSelect: PropTypes.func,
    pagingQueryParams: PropTypes.object,
    pagingTotal: PropTypes.number,
    resetPaginationState: PropTypes.func,
    setTotal: PropTypes.func
  };

  return connect(paginationSelector, {
    onSelect: setActivePage,
    sortColumn: setSorting,
    setFilter,
    setTotal,
    resetPaginationState
  })(WithPagination)
}
