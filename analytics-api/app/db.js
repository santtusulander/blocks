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
      },
      sp_account: {
        select: 'sp_account_id AS `account`',
        where: 'AND sp_account_id = ?',
        field: 'sp_account_id'
      },
      sp_group: {
        select: 'sp_group_id AS `group`',
        where: 'AND sp_group_id = ?',
        field: 'sp_group_id'
      },
      sp_asset: {
        select: 'sp_asset AS `asset`',
        where: 'AND sp_asset = ?',
        field: 'sp_asset'
      },
      sp_account_ids: {
        select: 'sp_account_id AS `sp_account`',
        where: 'AND sp_account_id IN ( ? )',
        field: 'sp_account_id'
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
      sp_account   : null,
      sp_group     : null,
      asset        : null,
      net_type     : null,
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
   * Get the average cache hit rate, time to first byte, transfer rates (average, peak, low, total),
   * bytes (average, peak, low, total), requests (average, peak, low, total), and
   * connections (average, peak, low, total).
   * NOTE: The data returned is grouped by account level and optionally epoch_start.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getTraffic(options) {
    let optionsFinal      = this._getQueryOptions(options);
    let isListingChildren = optionsFinal.list_children;
    let accountLevel      = this._getAccountLevel(optionsFinal, isListingChildren);
    let accountLevelData  = this.accountLevelFieldMap[accountLevel];
    let conditions        = [];
    let grouping          = [];
    let queryOptions      = [];

    // Build the table name
    let tableGranularity = optionsFinal.resolution || optionsFinal.granularity;
    let table = `${accountLevel}_global_${tableGranularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (tableGranularity === 'day' || tableGranularity === 'month') {
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
      && !isListingChildren
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    // Build the GROUP BY clause
    grouping.push(accountLevelData.field);
    optionsFinal.is_detail && grouping.push('epoch_start');

    let queryParameterized = `
      SELECT
        epoch_start as timestamp,
        ${accountLevelData.select},
        sum(bytes) as bytes,
        max(bytes) as bytes_peak,
        min(bytes) as bytes_lowest,
        round(avg(bytes)) as bytes_average,
        sum(requests) as requests,
        max(requests) as requests_peak,
        min(requests) as requests_lowest,
        round(avg(requests)) as requests_average,
        sum(connections) as connections,
        max(connections) as connections_peak,
        min(connections) as connections_lowest,
        round(avg(connections)) as connections_average,
        round(sum(connections * chit_ratio) / sum(connections) * 100) as chit_ratio,
        round(sum(connections * avg_fbl) / sum(connections)) as avg_fbl
      FROM ??
      WHERE ${conditions.join('\n        ')}
        AND flow_dir = 'out'
      ${grouping.length ? 'GROUP BY' : ''}
        ${grouping.join(',\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }


  /**
   * Get total and detailed traffic information.
   *
   * @param  {object}  options Options that get piped into SQL queries
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getTrafficWithTotals(options) {
    let optionsTotals = Object.assign({}, options, {is_detail: false});
    let optionsDetail = Object.assign({}, options, {is_detail: true});
    let queries = [];

    options.show_totals && queries.push(this.getTraffic(optionsTotals));
    options.show_detail && queries.push(this.getTraffic(optionsDetail));

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        let dataTotals = [];
        let dataDetail = [];

        if (queryData.length === 1) {
          dataTotals = options.show_totals ? queryData[0] : [];
          dataDetail = options.show_detail ? queryData[0] : [];

        } else if (queryData.length === 2) {
          dataTotals = options.show_totals ? queryData[0] : [];
          dataDetail = options.show_detail ? queryData[1] : [];
        }

        return [dataTotals, dataDetail];
      })
      .catch((err) => log.error(err));
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

    let queryParameterized = `
      SELECT
        epoch_start AS timestamp,
        sum(bytes) AS bytes
      FROM ??
      WHERE ${conditions.join('\n        ')}
        AND flow_dir = 'out';
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
        ${(selectedDimension || isListingChildren) ? 'sum(bytes) AS bytes' : 'bytes'},
        ${(selectedDimension || isListingChildren) ? 'sum(requests) AS requests' : 'requests'}
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
    let shouldQueryGlobalTotals = options.dimension === 'country';
    let aggregateGranularity    = options.aggregate_granularity || 'month';
    let dimensionTotalOptions   = {granularity: aggregateGranularity, isAggregate: true};
    let globalTotalOptions      = {dimension: 'global', granularity: aggregateGranularity, isAggregate: true};
    let queries = [
      // Detailed records for each dimension value
      this.getVisitors(options),

      // Totals for each dimension value
      this.getVisitors(Object.assign({}, options, dimensionTotalOptions))
    ];

    // Conditionally check the global tables to get grand totals
    if (shouldQueryGlobalTotals) {
      let globalTotalQuery = this.getVisitors(Object.assign({}, options, globalTotalOptions));
      queries.push(globalTotalQuery);
    }

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);

        // Sum the dimension totals to get the grand total, instead of querying the global tables
        if (!shouldQueryGlobalTotals) {
          let summedDimensionTotals = _.sumBy(queryData[1], 'uniq_vis');
          queryData.push(summedDimensionTotals);

        } else {
          // Return the uniq_vis value from the buried array for the grand total data
          let grandTotalData = queryData[2];
          let totalExists = !!(grandTotalData && grandTotalData[0] && _.isNumber(grandTotalData[0].uniq_vis));
          queryData[2] = totalExists ? grandTotalData[0].uniq_vis : null;
        }
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
        sum(requests) AS requests,
        status_code
      FROM url_property_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        url_path,
        status_code
      ORDER BY ${optionsFinal.sort_by || 'bytes'} ${optionsFinal.sort_dir.toUpperCase()}
      LIMIT ${optionsFinal.limit || 1000};
    `;

    return this._executeQuery(queryParameterized, queryOptions);

  }

  /**
   * Get traffic information for an account broken down by net type.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getOnOffNetTraffic(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryOptions     = [];
    let conditions       = [];

    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.asset
      && conditions.push(this.accountLevelFieldMap.sp_asset.where)
      && queryOptions.push(optionsFinal.asset);

    conditions.push('AND net_type IN ("on", "off")');
    conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.sp_account.select},
        epoch_start as timestamp,
        net_type,
        sum(bytes) AS bytes
      FROM sp_property_global_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        epoch_start,
        net_type
      ORDER BY epoch_start ASC;
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get total and detailed traffic information.
   *
   * @param  {object}  options Options that get piped into SQL queries
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPContributionData(options) {
    let queries = [];

    queries.push(this.getSPContributionTraffic(options));
    queries.push(this.getSPContributionCountryTraffic(options));
    queries.push(this.getSPContributionTrafficTotal(options));

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);

        // Set the total bytes to be a number instead of an array containing a single object
        queryData[2] = _.get(queryData[2], [0, 'bytes'], null);
        return queryData;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get traffic information for a CP account broken down by service provider, service type, and net type.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPContributionTraffic(options) {
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

    optionsFinal.sp_account_ids
      && conditions.push(this.accountLevelFieldMap.sp_account_ids.where)
      && queryOptions.push(optionsFinal.sp_account_ids);

    optionsFinal.net_type
      && conditions.push('AND net_type = ?')
      && queryOptions.push(optionsFinal.net_type);

    !optionsFinal.net_type
      && conditions.push('AND net_type IN ("on", "off")');

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    !optionsFinal.service_type
      && conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.sp_account_ids.select},
        net_type,
        service_type,
        sum(bytes) AS bytes
      FROM sp_property_global_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        sp_account_id,
        net_type,
        service_type;
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get traffic information for a CP account broken down by service provider and country.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPContributionCountryTraffic(options) {
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

    optionsFinal.sp_account_ids
      && conditions.push(this.accountLevelFieldMap.sp_account_ids.where)
      && queryOptions.push(optionsFinal.sp_account_ids);

    optionsFinal.net_type
      && conditions.push('AND net_type = ?')
      && queryOptions.push(optionsFinal.net_type);

    !optionsFinal.net_type
      && conditions.push('AND net_type IN ("on", "off")');

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    !optionsFinal.service_type
      && conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.sp_account_ids.select},
        country,
        sum(bytes) AS bytes
      FROM sp_property_country_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')}
      GROUP BY
        sp_account_id,
        country;
    `;

    return this._executeQuery(queryParameterized, queryOptions);

  }

  /**
   * Get the total number of bytes limited by account, group, property,
   * sp account(s), net type, and/or service type.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPContributionTrafficTotal(options) {
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

    optionsFinal.sp_account_ids
      && conditions.push(this.accountLevelFieldMap.sp_account_ids.where)
      && queryOptions.push(optionsFinal.sp_account_ids);

    optionsFinal.net_type
      && conditions.push('AND net_type = ?')
      && queryOptions.push(optionsFinal.net_type);

    !optionsFinal.net_type
      && conditions.push('AND net_type IN ("on", "off")');

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    !optionsFinal.service_type
      && conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT
        sum(bytes) AS bytes
      FROM sp_property_global_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${conditions.join('\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryOptions);

  }

  /**
   * Get list of entities
   */
  getEntitiesWithTrafficForEntities(options) {
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

    optionsFinal.sp_account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.sp_account);

    optionsFinal.sp_group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.sp_group);

    optionsFinal.asset
      && conditions.push(this.accountLevelFieldMap.sp_asset.where)
      && queryOptions.push(optionsFinal.asset);

    optionsFinal.net_type
      && conditions.push('AND net_type = ?')
      && queryOptions.push(optionsFinal.net_type);

    !optionsFinal.net_type
      && conditions.push('AND net_type IN ("on", "off")');

    optionsFinal.service_type
      && conditions.push('AND service_type = ?')
      && queryOptions.push(optionsFinal.service_type);

    !optionsFinal.service_type
      && conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT DISTINCT ${optionsFinal.entity}
      FROM sp_property_global_day
      WHERE timezone = "UTC"
        AND epoch_start BETWEEN ? AND ?
        ${conditions.join('\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get data stored in the schema_info table
   */
  getSchemaInfo() {
    return this._executeQuery('SELECT * FROM schema_info;');
  }

}

module.exports = new AnalyticsDB(configs);
