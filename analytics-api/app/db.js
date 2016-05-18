'use strict';

let Promise = require('bluebird');
let _       = require('lodash');
let mysql   = require('promise-mysql');
let configs = require('./configs');
let log     = require('./logger');

/**
 * A collection of functions that query and return data from the MySQL analytics
 * database. NOTE: This file exports an instance of this class, effectively
 * making it a singleton. This is intentional — we should only ever create one
 * connection pool.
 * @class
 */
class AnalyticsDB {

  /**
   * Sets up statics instance properties for on the instance of the class.
   *
   * @param {object} cfg Configs used to set up the connection pool.
   */
  constructor(cfg) {
    this.pool = mysql.createPool({
      connectionLimit : cfg.dbConnectionLimit,
      host            : cfg.dbHost,
      user            : cfg.dbUser,
      password        : cfg.dbPassword,
      database        : cfg.dbName
    });

    this.accountLevelFieldMap = {
      account: {
        select: 'account_id AS `account`',
        where: 'AND account_id = ?',
        field: 'account_id'
      },
      group: {
        select: 'group_id AS `group`',
        where: 'AND group_id = ?',
        field: 'group_id'
      },
      property: {
        select: 'property',
        where: 'AND property = ?',
        field: 'property'
      }
    }

    // Notify the log if a database connection couldn't be created
    this.pool.getConnection((err, connection) => {
      if (err) {
        (err.code === 'ECONNREFUSED') && log.error('Could not connect to the database. Kill the Analytics API process, ensure the database is up and running, and restart the API.');
        log.error(err);
      } else {
        connection.release();
      }
    });
  }

  /**
   * Inject data into a parameterized query and execute it.
   *
   * @private
   * @param  {string}  query A parameterized query
   * @param  {array}   data  The data to inject into the query
   * @return {Promise}       Returns a promise that is fulfilled with the query results
   */
  _executeQuery(query, data) {
    // NOTE: We do this instead of passing an array of data to db.pool.query so we
    // can log the actual query before executing it.
    // NOTE: mysql.format automatically escapes the data to avoid SQL injection attacks.
    let queryFinal = mysql.format(query, data);

    log.debug('query:', queryFinal);

    // Grab a connection from the pool and run the query
    return this.pool.query(queryFinal);
  }

  /**
   * Get an object of options that gets piped into a parameterized query.
   *
   * @private
   * @param  {object} options The custom options to merge with the defaults
   * @return {object}         An object literal with default options
   */
  _getQueryOptions(options) {
    let optionDefaults = {
      start        : null,
      end          : Math.round(Date.now() / 1000),
      account      : null,
      account_min  : null,
      account_max  : null,
      group        : null,
      property     : null,
      service_type : null,
      dimension    : 'global',
      granularity  : 'hour',
      sort_dir     : 'DESC'
    }

    // Remove any properties that have undefined values
    _.forOwn(options, (value, key) => {
      _.isUndefined(value) && delete options[key]
    });

    return Object.assign({}, optionDefaults, options || {});
  }

  /**
   * Based on an options object, return the appropriate account level.
   *
   * @private
   * @param  {object} options            Options object that contains keys for
   *                                     account, group, and/or property
   * @param  {boolean} isListingChildren Determines whether or not the caller
   *                                     is trying to list children of a level.
   *                                     For example, if the caller is trying to
   *                                     list properties of a group, this function
   *                                     needs to return 'property', but the caller
   *                                     would only provide account and group values.
   * @return {string}                    Will return 'account', 'group', or 'property'
   *                                     Returns null if the level could not be determined
   */
  _getAccountLevel(options, isListingChildren) {
    let accountLevel;
    isListingChildren = !!isListingChildren || false;

    if (isListingChildren) {

      if (options.group && options.account) {
        accountLevel = 'property';
      } else if (options.account) {
        accountLevel = 'group';
      } else {
        accountLevel = 'account';
      }

    } else {

      if (options.property && options.group && options.account) {
        accountLevel = 'property';
      } else if (options.group && options.account) {
        accountLevel = 'group';
      } else if (options.account) {
        accountLevel = 'account';
      } else {
        accountLevel = null;
      }

    }

    return accountLevel;
  }

  /**
   * Get the average cache hit rate, time to first byte, and transfer rates for
   * each property in a group.
   * NOTE: The data returned is grouped by account level.
   *
   * @private
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  _getAggregateNumbers(options, isListingChildren) {
    isListingChildren    = !!isListingChildren || false;
    let optionsFinal     = this._getQueryOptions(options);
    let accountLevel     = this._getAccountLevel(optionsFinal, isListingChildren);
    let accountLevelData = this.accountLevelFieldMap[accountLevel];
    let conditions       = [];
    let queryOptions     = [];

    // Build the table name
    let table = `${accountLevel}_global_${optionsFinal.granularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (optionsFinal.granularity === 'day' || optionsFinal.granularity === 'month') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    if (!optionsFinal.account && optionsFinal.account_min != null && optionsFinal.account_max != null) {
      conditions.push(`AND account_id BETWEEN ${optionsFinal.account_min} AND ${optionsFinal.account_max}`);
    }

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && !isListingChildren
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    let queryParameterized = `
      SELECT
        epoch_start,
        ${accountLevelData.select},
        max(bytes) as bytes_peak,
        min(bytes) as bytes_lowest,
        avg(bytes) as bytes_average,
        round(sum(connections * chit_ratio) / sum(connections) * 100) as chit_ratio,
        round(sum(connections * avg_fbl) / sum(connections)) as avg_fbl
      FROM ??
      WHERE ${conditions.join('\n        ')}
        AND flow_dir = 'out'
      GROUP BY ${accountLevelData.field};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get traffic data, cache hit rate, and transfer rates for all properties/groups
   * in a group/account within a given time range.
   *
   * @param  {object}  options Options that get piped into SQL queries
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getMetrics(options) {
    let queries = [
      this.getEgressWithHistorical(options, true),
      this._getAggregateNumbers(options, true)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        let queryDataOrganized = [];

        // queryData[0] is an array with two items (one for traffic data, and
        // one for historical traffic data)
        queryDataOrganized = queryDataOrganized.concat(queryData[0]);

        // queryData[1] is an array of account levels with aggregate traffic data
        queryDataOrganized.push(queryData[1]);

        // NOTE: queryDataOrganized ends up looking something like this:
        // [trafficData, historicalTrafficData, aggregateData]
        log.info(`Successfully received data from ${queryDataOrganized.length} queries.`);
        return queryDataOrganized;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get total outbound traffic (egress) for a month or day, for a property,
   * group, or account.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getEgressTotal(options) {
    let optionsFinal    = this._getQueryOptions(options);
    let secondsPerMonth = 2678399;
    let secondsPerDay   = 86399;
    let duration        = optionsFinal.end - optionsFinal.start;
    let accountLevel    = this._getAccountLevel(optionsFinal) || 'property';
    let conditions      = [];
    let granularity;

    // Granularity
    if (duration === secondsPerMonth) {
      granularity = 'month';
    } else if (duration === secondsPerDay) {
      granularity = 'day';
    } else {
      granularity = 'day';
    }

    // Build the table name
    let table = `${accountLevel}_global_${granularity}`;

    // Build the WHERE clause
    if (granularity === 'day' || granularity === 'month') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account  && conditions.push('AND account_id = ?');
    optionsFinal.group    && conditions.push('AND group_id = ?');
    optionsFinal.property && conditions.push('AND property = ?');

    // TODO: should this GROUP BY account_id, group_id, and property instead of epoch_start?
    let queryParameterized = `
      SELECT
        epoch_start AS timestamp,
        sum(bytes) AS bytes
      FROM ??
      WHERE ${conditions.join('\n        ')}
        AND flow_dir = 'out'
      GROUP BY epoch_start;
    `;

    return this._executeQuery(queryParameterized, [
      table,
      optionsFinal.start,
      optionsFinal.end,
      optionsFinal.account,
      optionsFinal.group,
      optionsFinal.property
    ]);
  }

  /**
   * Get outbound traffic (egress) for a property, group, or account.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @param  {boolean} isListingChildren Determines whether or not the caller
   *                                     is trying to list children of a level.
   *                                     See _getAccountLevel for more info.
   * @return {Promise}                   A promise that is fulfilled with the
   *                                     query results
   */
  getEgress(options, isListingChildren) {
    isListingChildren    = !!isListingChildren || false;
    let optionsFinal     = this._getQueryOptions(options);
    let accountLevel     = this._getAccountLevel(optionsFinal, isListingChildren);
    let accountLevelData = this.accountLevelFieldMap[accountLevel];
    let conditions       = [];
    let grouping         = [];
    let queryOptions     = [];
    let selectedDimension;

    // Build the SELECT clause
    // Include the dimension option as a column to be selected unless it's
    // undefined or the default value of 'global'
    if (optionsFinal.dimension && optionsFinal.dimension !== 'global') {
      selectedDimension = `${optionsFinal.dimension},\n        `;
    } else {
      selectedDimension = '';
    }

    // Build the table name
    let table = `${accountLevel}_${optionsFinal.dimension}_${optionsFinal.granularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (optionsFinal.granularity === 'day' || optionsFinal.granularity === 'month') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    if (!optionsFinal.account && optionsFinal.account_min != null && optionsFinal.account_max != null) {
      conditions.push(`AND account_id BETWEEN ${optionsFinal.account_min} AND ${optionsFinal.account_max}`);
    }

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && !isListingChildren
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    // Build the GROUP BY clause
    selectedDimension && grouping.push(selectedDimension);
    (selectedDimension || isListingChildren) && grouping.push('epoch_start');
    grouping.length && grouping.unshift(accountLevelData.field + ',\n        ');

    let queryParameterized = `
      SELECT
        epoch_start AS timestamp,
        ${accountLevelData.select},
        ${selectedDimension}service_type,
        ${(selectedDimension || isListingChildren) ? 'sum(bytes) AS bytes' : 'bytes'}
      FROM ??
      WHERE ${conditions.join('\n        ')}
        AND flow_dir = 'out'
      ${grouping.length ? 'GROUP BY' : ''}
        ${grouping.join('')}
      ORDER BY
        ${selectedDimension}epoch_start,
        ${accountLevelData.field},
        service_type;
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }


  /**
   * Get outbound traffic (egress) for a property, group, or account for a
   * requested time frame AND the previous time frame of the same duration.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @param  {boolean} isListingChildren Determines whether or not the caller
   *                                     is trying to list children of a level.
   *                                     See _getAccountLevel for more info.
   * @return {Promise}                   A promise that is fulfilled with the query results
   */
  getEgressWithHistorical(options, isListingChildren) {
    isListingChildren   = !!isListingChildren || false;
    let optionsFinal    = this._getQueryOptions(options);
    let start           = parseInt(optionsFinal.start);
    let end             = parseInt(optionsFinal.end);
    let duration        = end - start + 1;
    let optionsHistoric = Object.assign({}, optionsFinal, {
      start: start - duration,
      end: start - 1
    });
    let queries = [
      this.getEgress(optionsFinal, isListingChildren),
      this.getEgress(optionsHistoric, isListingChildren)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        return queryData;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get unique visitor data for a property, group, or account.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getVisitors(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let accountLevel     = this._getAccountLevel(optionsFinal);
    let accountLevelData = this.accountLevelFieldMap[accountLevel];
    let conditions       = [];
    let grouping         = [];
    let queryOptions     = [];
    let selectedDimension;

    // Build the SELECT clause
    // Include the dimension option as a column to be selected unless it's
    // undefined or the default value of 'global'
    if (optionsFinal.dimension && optionsFinal.dimension !== 'global') {
      selectedDimension = `${optionsFinal.dimension}`;
    } else {
      selectedDimension = '';
    }

    let isTrafficTable = !!(optionsFinal.dimension === 'country' || optionsFinal.dimension === 'global');

    // Build the table name
    let table = `${accountLevel}_${optionsFinal.dimension}_${optionsFinal.granularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (optionsFinal.granularity === 'day' || optionsFinal.granularity === 'month') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    isTrafficTable && conditions.push('AND flow_dir = \'out\'');

    // Build the GROUP BY clause
    selectedDimension && grouping.push(selectedDimension);
    !optionsFinal.isAggregate && grouping.push('epoch_start');
    grouping.length && grouping.unshift(accountLevelData.field);

    let queryParameterized = `
      SELECT
        epoch_start AS timestamp,
        ${accountLevelData.select},
        ${selectedDimension ? selectedDimension + ',\n        ' : ''}${isTrafficTable ? 'sum(uniq_vis) AS uniq_vis' : 'uniq_vis'}
      FROM ??
      WHERE ${conditions.join('\n        ')}
      ${grouping.length ? 'GROUP BY' : ''}
        ${grouping.join(',\n        ')}
      ORDER BY
        ${selectedDimension ? selectedDimension + ',\n        ' : ''}epoch_start,
        ${accountLevelData.field};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get unique visitor totals for a property, group, or account.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getVisitorWithTotals(options) {
    let aggregateGranularity  = options.aggregate_granularity || 'month';
    let dimensionTotalOptions = {granularity: aggregateGranularity, isAggregate: true};
    let grandTotalOptions     = {dimension: 'global', granularity: aggregateGranularity, isAggregate: true};
    let queries = [
      this.getVisitors(options),
      this.getVisitors(Object.assign({}, options, dimensionTotalOptions)),
      this.getVisitors(Object.assign({}, options, grandTotalOptions))
    ];

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        return queryData;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get response error and traffic information for a property, group, or account
   * broken down by status code and URL.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getFileErrors(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryOptions     = [];
    let conditions       = [];

    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    conditions.push("AND (status_code LIKE '4%' OR status_code LIKE '5%')");

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    let queryParameterized = `
      SELECT
        status_code,
        url_path AS url,
        sum(bytes) AS bytes,
        sum(requests) AS requests,
        service_type
      FROM url_property_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        url_path,
        service_type,
        status_code
      ORDER BY bytes DESC;
    `;

    return this._executeQuery(queryParameterized, queryOptions);

  }

  /**
   * Get traffic information for an account, group, or property broken down by URL.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getTrafficByUrl(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryOptions     = [];
    let conditions       = [];

    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    if (optionsFinal.status_codes) {
      let statusCodeConditions = [];
      optionsFinal.status_codes.forEach((code) => {
        if (code.indexOf('xx') === 1) {
          statusCodeConditions.push(`status_code LIKE '${code.charAt(0)}%'`);
        } else {
          statusCodeConditions.push(`status_code = ${code}`);
        }
      });
      conditions.push(`AND (${statusCodeConditions.join(' OR ')})`);
    }

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    let queryParameterized = `
      SELECT
        url_path AS url,
        sum(bytes) AS bytes,
        sum(requests) AS requests
      FROM url_property_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        url_path
      ORDER BY ${optionsFinal.sort_by || 'bytes'} ${optionsFinal.sort_dir.toUpperCase()}
      LIMIT ${optionsFinal.limit || 1000};
    `;

    return this._executeQuery(queryParameterized, queryOptions);

  }

}

module.exports = new AnalyticsDB(configs);
