import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fromJS, Map } from 'immutable'

import paginationSelectors from '../redux/modules/pagination/pagination-selectors'
import paginationActionCreators from '../redux/modules/pagination/actions'
import { SET_ACTIVE_PAGE, SET_TOTAL, SET_SORTING, SET_FILTERING, INVALIDATE } from '../redux/modules/pagination/actionTypes'

/**
 * Decorate component with pagination functionality.
 * @param {React.Component} WrappedComponent - component to decorate
 * @param {object} config - pagination parameters to override defaults
 * @return {WithPagination}
 */
export const withPagination = (WrappedComponent, config = {}) => {
  /** @typedef {string} actionType - type of action */

  /**
   * @typedef {function} paginationSubscription
   * Used to compose payload data from parameters
   */


  /**
   * Config object with default pagination params.
   * Merged {@link WithPagination} default parameters with {@link WrappedComponent} config.
   * @type {Object}
   * @private
   */
  const _defaultProps = {...{
    activePage: 1,
    page_size: 50,
    total: 0,
    offset: 0,
    fields: null,
    sort_order: null,
    sort_by: null,
    filter_by: null,
    filter_value: ''
  }, ...config};

  /** @class WithPagination */
  return class WithPagination extends Component {

    static get defaultProps() {
      return _defaultProps;
    }

    static get propTypes() {
      return {
        activePage: PropTypes.number,
        fields: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), null]),
        filter_by: PropTypes.string,
        filter_value: PropTypes.string,
        isPristine: PropTypes.bool,
        offset: PropTypes.number,
        page_size: PropTypes.number,
        paginationActions: PropTypes.object,
        sort_by: PropTypes.string,
        sort_order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        total: PropTypes.number
      };
    }

    /**
     * Composed display name
     * @return {string}
     */
    static get displayName() {
      return `WithPagination${WrappedComponent['displayName'] || WrappedComponent['name']} || Component`;
    }

    /**
     * Get pages count to render pagination component or hide if count = 0.
     * @param {number} total - data length
     * @param {number} pageSize - items per page
     * @returns {number}
     */
    static getPaginationItemsCount(total, pageSize = 1) {
      return total > pageSize ? Math.ceil(total/pageSize) : 0;
    }

    /**
     * @function payloadFormatter
     * Used to format (normalize) payload before being dispatched
     * @param {any} payload - payload to dispatch
     * @return {any} - formatted payload
     */

    /**
     * @readonly Payload formatters Map.
     * @type {Immutable.Map.<string, payloadFormatter>}
     */
    static get formatters() {
      return Map([
        [
          /* format sort_order from -1, 1 to 'asc', 'desc' supported by API and vice versa */
          'sort_order',
          (v) => {
            return v === 'asc' ? 1 : v === 'desc' ? -1 : v === 1 ? 'asc' : v === -1 ? 'desc' : v
          }
        ],
        [
          /* format 'fields' array to string supported by API */
          'fields',
          (v) => v.join()
        ]
      ])
    }

    /**
     * @function payloadValidator
     * Used to validate payload before being dispatched
     * @param {any} payload - payload to dispatch
     * @return {bool} - valid status (true - valid, false - invalid)
     */

    /**
     * @readonly Payload validators Map.
     * @type {Immutable.Map.<actionType, payloadValidator>} - Map
     */
    static get validators() {
      const isDefined = (v) => v !== null && typeof v !== 'undefined';
      const keysInObject = (obj, keys) => keys.every(k => obj.hasOwnProperty(k));

      return Map([
        [
          /* total payload should be >= 0 */
          SET_TOTAL,
          (payload) => isDefined(payload) && payload >= 0
        ],
        [
          /* activePage payload should be an object with 'activePage'(not 0), 'offset' fields */
          SET_ACTIVE_PAGE,
          (payload) => {
            const keys = ['activePage', 'offset'];

            return isDefined(payload) && keysInObject(payload, keys) &&
              Object.values(payload).every(Number.isInteger) && payload.activePage !== 0;
          }
        ],
        [
          /* sorting payload should be an object with 'sort_by', 'sort_order'(asc|desc) fields */
          SET_SORTING,
          (payload) => {
            const keys = ['sort_by', 'sort_order'];

            return isDefined(payload) && keysInObject(payload, keys) &&
              keys.every(k => typeof payload[k] === 'string') &&
              ['asc', 'desc'].indexOf(payload.sort_order) > -1;
          }
        ],
        [
          /* filtering payload should be an object with 'filter_by', 'filter_value' fields */
          SET_FILTERING,
          (payload) => {
            const keys = ['filter_by', 'filter_value'];

            return isDefined(payload) && keysInObject(payload, keys);
          }
        ],
        [
          /* invalidating always returns true */
          INVALIDATE,
          () => true
        ]
      ])
    }

    /**
     * @typedef {function} subscriptionMaker
     * @param {paginationSubscription}
     * @param {string} - actionType
     * @return {function}
     */

    /**
     * Initialize decorator (high-order) function.
     * Returned decorator is used to associate {@link paginationSubscription} with appropriate actionType, actionCreator
     * and {@link payloadValidator}.
     * After decoration {@link paginationSubscription} is able to dispatch action if payload is valid.
     *
     * @param {Object} actions - actionCreators
     * @param {Immutable.Map.<actionType, payloadValidator>} validators
     * @return {function(*, *=): function(...[*])}
     */
    static initSubscriptionDecorator(actions, validators) {
      /** {@link subscriptionMaker} */
      return (subscription, actionType) => (...args) => {
        const payload = subscription(...args);

        return validators.has(actionType) ?
          validators.get(actionType)(payload) && actions[actionType](payload) :
          actions[actionType](payload);
      }
    }

    /**
     * @typedef {Immutable.Map} paginationObserver
     * Optionally can be used by decorated component to be notified of changes to paginationParams
     * Subscription is realizing by providing callback with argument for pagination params
     * @property register {function} - register subscriber
     * @property notify {function} - notify registered subscribers
     * @property reset {function} - reset subscribers
     */

    /**
     * Initialize paginationSubscribers
     * @static
     * @return {paginationObserver}
     */
    static initPaginationSubscribersService() {
      /** @private */
      const subscribers = [];
      return Map({
        register: (subscriber) => {
          if (typeof subscriber === 'function') {
            subscribers.push(subscriber);
          }
        },
        notify: (payload) => {
          if (subscribers.length) {
            subscribers.forEach((s) => s(payload))
          }
        },
        reset: () => {
          subscribers.length = 0
        }
      });
    }

    constructor(props) {
      super(props);
      const { initSubscriptionDecorator, initPaginationSubscribersService, validators } = this.constructor;
      const makeSubscription = initSubscriptionDecorator(props.paginationActions, validators);

      this.paginationSubscribers = initPaginationSubscribersService();

      this.getQueryParams = this.getQueryParams.bind(this);

      this.totalSubscription = makeSubscription(this.totalSubscription.bind(this), SET_TOTAL);
      this.activePageSubscription = makeSubscription(this.activePageSubscription.bind(this), SET_ACTIVE_PAGE);
      this.sortingSubscription = makeSubscription(this.sortingSubscription.bind(this), SET_SORTING);
      this.filterSubscription = makeSubscription(this.filterSubscription.bind(this), SET_FILTERING);
      this.resetPaginationState = makeSubscription(() => null, INVALIDATE);
    }

    /**
     * Using lifecycle hook to notify pagination subscribers if queryParams changed
     * @param nextProps {object}
     */
    componentWillReceiveProps(nextProps) {
      if (nextProps.isPristine) {
        return;
      }

      const queryParams = this.getQueryParams(nextProps);
      const diff = !fromJS(queryParams).equals(fromJS(this.getQueryParams(this.props)));

      if (diff) {
        this.paginationSubscribers.get('notify')(queryParams);
      }
    }

    /**
     * Do clean-up when component unmounted:
     * - Reset pagination state to default
     * - Reset pagination subscribers
     */
    componentWillUnmount() {
      this.resetPaginationState();
      this.paginationSubscribers.get('reset')();
    }

    /**
     * {@link paginationSubscription}
     * Returns {sort_by, sort_order} payload to be dispatched or null.
     * @param {string} sort_by - value by which data should be sorted
     * @param {string} order - value to order sorted data.
     * @return {Object|null}
     */
    sortingSubscription(sort_by, order) {
      const sort_order = WithPagination.formatters.get('sort_order')(order);
      const diff = (
        sort_by !== this.props.sort_by && sort_order === this.props.sort_order ||
        sort_by === this.props.sort_by && sort_order !== this.props.sort_order ||
        sort_by !== this.props.sort_by && sort_order !== this.props.sort_order
      );

      return diff ? { sort_by, sort_order } : null;
    }

    /**
     * {@link paginationSubscription}
     * Compare filtering payload data and returns if differ.
     * @param filter_value {string} - value to filter data
     * @param filter_by {string} - value by which data should be filtered
     * @return {Object|null}
     */
    filterSubscription(filter_by, filter_value) {
      const diff = (
        filter_by !== this.props.filter_by && filter_value === this.props.filter_value ||
        filter_by === this.props.filter_by && filter_value !== this.props.filter_value ||
        filter_by !== this.props.filter_by && filter_value !== this.props.filter_value
      );
      return diff ? { filter_by, filter_value } : null;
    }

    /**
     * {@link paginationSubscription}
     * Returns {offset, activePage} payload to be dispatched or null.
     * @param {number} page - active page used for offset calculation
     * @return {Object|null}
     */
    activePageSubscription(page = 1) {
      const { activePage, page_size } = this.props;
      const offset = (page -1) * page_size;

      return (page !== activePage && page_size > 0) ? {offset, activePage: page} : null;
    }

    /**
     * {@link paginationSubscription}
     * Returns total payload to be dispatched or null.
     * @param {number} total - total amount of data items, used to build pagination component
     * @return {?number}
     */
    totalSubscription(total) {
      return total !== this.props.total ? total : null;
    }

    /**
     * Get queryParams object from props
     * @param params {object} - object contains pagination params
     * @returns {{offset, page_size, sort_by, sort_order, filter_by, filter_value}}
     */
    getQueryParams(params = this.props) {
      let { offset, sort_by, sort_order, filter_by, filter_value, fields } = params;
      const { page_size } = params

      if (!filter_by || !filter_value) {
        filter_by = null;
        filter_value = null;
      } else {
        /* reset offset for filtering through all data */
        offset = 0;
      }

      if (!sort_by || !sort_order) {
        sort_by = null;
        sort_order = null;
      }

      if (!fields || Array.isArray(fields) && !fields.length) {
        fields = null;
      } else {
        fields = WithPagination.formatters.get('fields')(fields);
      }

      return  { offset, page_size, sort_by, sort_order, filter_by, filter_value, fields };
    }

    render() {

      const {
        offset, page_size, sort_by, sort_order, filter_by, filter_value, activePage, total,
        ...passThroughProps
      } = this.props;

      /* compose paging props */
      const paging = {
        activePage, offset, page_size,
        items: WithPagination.getPaginationItemsCount(total, page_size),
        onActivePageChange: this.activePageSubscription,
        onTotalChange: this.totalSubscription
      };

      /* compose filtering props */
      const filtering = {
        filter_by, filter_value,
        onFilterChange: this.filterSubscription
      };

      /* compose sorting props */
      const sorting = {
        sort_by,
        sort_order: WithPagination.formatters.get('sort_order')(sort_order),
        onSortingChange: this.sortingSubscription
      };

      /* compose pagination props object to be passed to decorated component */
      const pagination = {
        filtering, paging, sorting,
        getQueryParams: this.getQueryParams,
        registerSubscriber: this.paginationSubscribers.get('register'),
        resetPagination: this.resetPaginationState
      };

      return (<WrappedComponent {...{pagination}} {...passThroughProps} />);
    }
  }
};

export default (WrappedComponent, config) => connect(
  paginationSelectors,
  (dispatch) => ({paginationActions: bindActionCreators(paginationActionCreators, dispatch)})
)(withPagination(WrappedComponent, config))
