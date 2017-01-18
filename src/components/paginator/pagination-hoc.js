import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

import paginationSelector from '../../redux/modules/pagination/pagination-selectors'
import { setActivePage, resetPaginationState, setTotal, setSorting } from '../../redux/modules/pagination/actions'

/**
 * @private
 * Holds apiMethod passed from wrapped component
 * @type {Array}
 */
const delegated = [];

export default function withPagination(WrappedComponent) {
  class WithPagination extends Component {
    /**
     * Get current page number
     * @param {number} offset
     * @returns {number}
     */
    static getActivePage({ offset }) {
      return offset + 1;
    }

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
      const activePage = this.getActivePage(pagingQueryParams);

      const pagingConfig = {
        onSelect,
        items,
        activePage
      };

      return { pagingConfig };
    }

    constructor(props) {
      super(props);

      this.updatePagingTotalFromResponse = this.updatePagingTotalFromResponse.bind(this);
    }

    componentWillReceiveProps(nextProps) {
      const { pagingQueryParams } = this.props;
      if (this.hasQueryParamsChanged(pagingQueryParams, nextProps.pagingQueryParams)) {
        this.callDelegatedFn();
      }
    }

    /**
     * Do clean-up when component unmounted
     */
    componentWillUnmount() {
      this.props.resetPaginationState()
      this.resetDelegated()
    }

    /**
     * Determinate equality of two objects values
     * @param currentParams {object}
     * @param nextParams {object}
     * @returns {boolean}
     */
    hasQueryParamsChanged(currentParams, nextParams) {
      return !fromJS(currentParams).equals(fromJS(nextParams))
    }

    /**
     * Save function passed by wrapped component
     * @param fn {function} - function to be called when pagination updates
     */
    setDelegatedFn(fn) {
      delegated.push(fn)
    }

    /**
     * Call delegated function if exist
     */
    callDelegatedFn() {
      if (delegated.length) delegated[0]()
    }

    /**
     * Reset delegated array
     */
    resetDelegated() {
      delegated.length = 0;
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

      const delegateToPagination = this.setDelegatedFn;

      return (
        <WrappedComponent
          {...this.props}
          {...pagingConfig}
          {...{delegateToPagination}}
          {...{updatePagingTotal}}
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
  }

  return connect(paginationSelector, {
    onSelect: setActivePage,
    sortColumn: setSorting,
    setTotal,
    resetPaginationState
  })(WithPagination)
}
