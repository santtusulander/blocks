import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

import pagingQueryParamsSelector from '../../redux/modules/pagination/pagination-selectors'
import { setActivePage, resetPaginationState, setTotal, setSorting } from '../../redux/modules/pagination/actions'

const delegated = [];

export default function withPagination(WrappedComponent) {
  class WithPagination extends Component {

    /**
     * Do clean-up when component unmounted
     */
    componentWillUnmount() {
      this.props.resetPaginationState()
      this.resetDelegated()
    }

    componentWillReceiveProps(nextProps) {
      const { pagingQueryParams } = this.props;
      if (this.hasQueryParamsChanged(pagingQueryParams, nextProps.pagingQueryParams)) {
        this.callDelegatedFn();
      }
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
     * Get count of pages
     * @param {number} total - total number of items
     * @param {number} page_size - items per page
     * @returns {number}
     */
    static getPagesCount({ total, page_size }) {
      return Math.ceil(total/page_size)
    }

    /**
     * Get current page number
     * @param {number} offset
     * @returns {number}
     */
    static getActivePage({ offset }) {
      return offset + 1;
    }

    /**
     * Get pagination config object composed from props
     * @param props {Object}
     * @returns {Object}
     */
    static getPagingConfig(props) {
      const { pagingQueryParams, onSelect } = props;
      const items = this.getPagesCount(pagingQueryParams);
      const activePage = this.getActivePage(pagingQueryParams);

      const pagingConfig = {
        onSelect,
        items,
        activePage
      };

      return { pagingConfig };
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

    render() {

      const pagingConfig = WithPagination.getPagingConfig(this.props);

      const delegateToPagination = this.setDelegatedFn;

      return (<WrappedComponent {...this.props} {...pagingConfig} {...{delegateToPagination}} />);
    }
  }

  WithPagination.propTypes = {
    pagingQueryParams: PropTypes.object
  }

  return connect(pagingQueryParamsSelector, {
    onSelect: setActivePage,
    sortColumn: setSorting,
    setTotal,
    resetPaginationState
  })(WithPagination)
}


