import React, { Component } from 'react'
import { connect } from 'react-redux'

import selector from '../../redux/modules/pagination/pagination-selectors'
import { setActivePage, resetPaginationState, setTotal, setSorting } from '../../redux/modules/pagination/actions'

export default function withPagination(WrappedComponent) {
  class WithPagination extends Component {

    componentWillUnmount() {
      this.props.resetPaginationState()
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

    render() {

      const pagingConfig = WithPagination.getPagingConfig(this.props);

      return (<WrappedComponent {...this.props} {...pagingConfig} />);
    }
  }

  return connect(selector, {
    onSelect: setActivePage,
    sortColumn: setSorting,
    setTotal,
    resetPaginationState
  })(WithPagination)
}


