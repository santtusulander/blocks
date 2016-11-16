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
        whereIn: 'AND account_id IN ( ? )',
        field: 'account_id'
      },
      group: {
        select: 'group_id AS `group`',
        where: 'AND group_id = ?',
        whereIn: 'AND group_id IN ( ? )',
        field: 'group_id'
      },
      property: {
        select: 'property',
        where: 'AND property = ?',
        whereIn: 'AND property IN ( ? )',
        field: 'property'
      },
      sp_account: {
        select: 'sp_account_id AS `sp_account`',
        where: 'AND sp_account_id = ?',
        whereIn: 'AND sp_account_id IN ( ? )',
        field: 'sp_account_id'
      },
      sp_account_sp: {
        select: 'sp_account_id AS `account`',
        where: 'AND sp_account_id = ?',
        whereIn: 'AND sp_account_id IN ( ? )',
        field: 'sp_account_id'
      },
      sp_group: {
        select: 'sp_group_id AS `sp_group`',
        where: 'AND sp_group_id = ?',
        whereIn: 'AND sp_group_id IN ( ? )',
        field: 'sp_group_id'
      },
      sp_group_sp: {
        select: 'sp_group_id AS `group`',
        where: 'AND account_id = ?',
        whereIn: 'AND sp_group_id IN ( ? )',
        field: 'sp_group_id'
      },
      asset: {
        select: 'sp_asset AS `asset`',
        where: 'AND sp_asset = ?',
        whereIn: 'AND sp_asset IN ( ? )',
        field: 'sp_asset'
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
   * @return {string}                    Will return 'account', 'group', or 'property'
   *                                     Returns null if the level could not be determined
   */
  _getAccountLevel(options) {
    let accountLevel;

    if (options.list_children) {

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
  _getAggregateNumbers(options) {
    let optionsFinal      = this._getQueryOptions(options);
    let isListingChildren = optionsFinal.list_children;
    let accountLevel      = this._getAccountLevel(optionsFinal);
    let accountLevelData  = this.accountLevelFieldMap[accountLevel];
    let conditions        = [];
    let queryOptions      = [];

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
    let accountLevel      = this._getAccountLevel(optionsFinal);
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
      && !optionsFinal.list_children
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
   * Get total and detailed Service Provider traffic information.
   *
   * @param  {object}  options Options that get piped into SQL queries
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPTrafficTotals(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let accountLevel     = this._getAccountLevel(optionsFinal);

    if (accountLevel === "account") {
      accountLevel = "sp_account_sp"
    }

    if (accountLevel === "group") {
      accountLevel = "sp_group_sp"
    }

    let accountLevelData = this.accountLevelFieldMap[accountLevel];
    let conditions       = [];
    let queryOptions     = [];

    // Build the table name
    let table = `spc_global_${optionsFinal.granularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (optionsFinal.granularity === 'day') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.account);

    if (!optionsFinal.account && optionsFinal.account_min != null && optionsFinal.account_max != null) {
      conditions.push(`AND spc_account_id BETWEEN ${optionsFinal.account_min} AND ${optionsFinal.account_max}`);
    }

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.group);

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
      GROUP BY ${accountLevelData.field};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Returns Service Provider egress traffic for a group or account.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the
   *                                     query results
   */
  getSpEgress(options) {
    let isListingChildren = !!options.list_children || false;
    let optionsFinal     = this._getQueryOptions(options);
    let accountLevel     = this._getAccountLevel(optionsFinal);

    if (accountLevel === "account") {
      accountLevel = "sp_account_sp"
    }

    if (accountLevel === "group") {
      accountLevel = "sp_group_sp"
    }

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
    let table = `spc_${optionsFinal.dimension}_${optionsFinal.granularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (optionsFinal.granularity === 'day') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.account);

    if (!optionsFinal.account && optionsFinal.account_min != null && optionsFinal.account_max != null) {
      conditions.push(`AND spc_account_id BETWEEN ${optionsFinal.account_min} AND ${optionsFinal.account_max}`);
    }

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.group);

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
   * Returns Service Provider traffic for a group or account.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the
   *                                     query results
   */
  getSpTraffic(options) {
    let optionsFinal      = this._getQueryOptions(options);
    let accountLevel      = this._getAccountLevel(optionsFinal);

    if (accountLevel === "account") {
      accountLevel = "sp_account_sp"
    }

    if (accountLevel === "group") {
      accountLevel = "sp_group_sp"
    }

    let accountLevelData  = this.accountLevelFieldMap[accountLevel];
    let conditions        = [];
    let grouping          = [];
    let queryOptions      = [];

    // Build the table name
    let tableGranularity = optionsFinal.resolution || optionsFinal.granularity;
    let table = `spc_global_${tableGranularity}`;
    queryOptions.push(table);
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    if (tableGranularity === 'day') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.group);

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
        sum(connections) as connections,
        max(connections) as connections_peak,
        min(connections) as connections_lowest,
        round(avg(connections)) as connections_average,
        round(sum(connections * chit_ratio) / sum(connections) * 100) as chit_ratio,
        round(sum(connections * avg_fbl) / sum(connections)) as avg_fbl
      FROM ??
      WHERE ${conditions.join('\n        ')}
      ${grouping.length ? 'GROUP BY' : ''}
        ${grouping.join(',\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get Service Provider traffic for a group or account for a
   * requested time frame AND the previous time frame of the same duration.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the query results
   */
  getSpEgressWithHistorical(options) {
    let optionsFinal    = this._getQueryOptions(options);
    let start           = parseInt(optionsFinal.start);
    let end             = parseInt(optionsFinal.end);
    let duration        = end - start + 1;
    let optionsHistoric = Object.assign({}, optionsFinal, {
      start: start - duration,
      end: start - 1
    });
    let queries = [
      this.getSpEgress(optionsFinal),
      this.getSpEgress(optionsHistoric)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        return queryData;
      })
      .catch((err) => log.error(err));
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

    // Skipping SP data fetching in case of unsupported query options
    if (options.granularity !== "5min" && options.granularity !== "month" && options.property === null) {
      options.show_totals && queries.push(this.getSpTraffic(optionsTotals));
      options.show_detail && queries.push(this.getSpTraffic(optionsDetail));
    }

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        let dataTotals = [];
        let dataDetail = [];
        let spDataTotals = [];
        let spDataDetail = [];

        if (queryData.length === 1) {
          dataTotals = options.show_totals ? queryData[0] : [];
          dataDetail = options.show_detail ? queryData[0] : [];

        } else if (queryData.length === 2) {
          if (options.show_detail) {
            dataTotals = options.show_totals ? queryData[0] : [];
            dataDetail = options.show_detail ? queryData[1] : [];
          } else {
            dataTotals = options.show_totals ? queryData[0] : [];
            spDataTotals = options.show_totals ? queryData[1] : [];
          }
        } else if (queryData.length === 4) {
          dataTotals = options.show_totals ? queryData[0] : [];
          dataDetail = options.show_detail ? queryData[1] : [];
          spDataTotals = options.show_totals ? queryData[2] : [];
          spDataDetail = options.show_detail ? queryData[3] : [];
        }

        return [dataTotals, dataDetail, spDataTotals, spDataDetail];
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
      this.getEgressWithHistorical(options),
      this._getAggregateNumbers(options),
      this.getSPTrafficTotals(options),
      this.getSpEgressWithHistorical(options)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        let queryDataOrganized = [];

        // queryData[0] is an array with two items (one for traffic data, and
        // one for historical traffic data)
        queryDataOrganized = queryDataOrganized.concat(queryData[0]);

        // queryData[1] is an array of account levels with aggregate traffic data
        queryDataOrganized.push(queryData[1]);
        queryDataOrganized.push(queryData[2]);
        queryDataOrganized = queryDataOrganized.concat(queryData[3]);

        // NOTE: queryDataOrganized ends up looking something like this:
        // [trafficData, historicalTrafficData, aggregateData]
        log.info(`Successfully received data from ${queryDataOrganized.length} queries.`);
        return queryDataOrganized;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get outbound traffic (egress) for a property, group, or account for a
   * requested time frame AND the previous time frame of the same duration (both for SP and CP).
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the query results
   */
  getDataForCountry(options) {
    let queries = [
      this.getEgressWithHistorical(options),
      this.getSpEgressWithHistorical(options)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        let queryDataOrganized = [];
        queryDataOrganized = queryDataOrganized.concat(queryData[0]);
        queryDataOrganized = queryDataOrganized.concat(queryData[1]);

        log.info(`Successfully received data from ${queryDataOrganized.length} queries.`);
        return queryDataOrganized;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get outbound traffic (egress) for a property, group, or account (both SP and CP).
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the
   *                                     query results
   */
  getTime(options) {
    let queries = [
      this.getEgress(options),
      this.getSpEgress(options)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        let queryDataOrganized = [];
        queryDataOrganized = queryDataOrganized.concat(queryData[0]);
        queryDataOrganized = queryDataOrganized.concat(queryData[1]);

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
   * Get total outbound traffic (egress) for a SP for a month or day, for a property,
   * group, or account.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSPEgressTotal(options) {
    let optionsFinal    = this._getQueryOptions(options);
    let conditions      = [];
    let granularity = "day";

    // Build the table name
    let table = `spc_global_${granularity}`;

    // Build the WHERE clause
    if (granularity === 'day' || granularity === 'month') {
      conditions.push("timezone = 'UTC' AND");
    }

    conditions.push('epoch_start BETWEEN ? AND ?');

    optionsFinal.account  && conditions.push('AND sp_account_id = ?');
    optionsFinal.group    && conditions.push('AND sp_group_id = ?');

    let queryParameterized = `
      SELECT
        epoch_start AS timestamp,
        sum(bytes) AS bytes
      FROM ??
      WHERE ${conditions.join('\n        ')};
    `;

    return this._executeQuery(queryParameterized, [
      table,
      optionsFinal.start,
      optionsFinal.end,
      optionsFinal.account,
      optionsFinal.group
    ]);
  }

  /**
   * Get traffic data, cache hit rate, and transfer rates for all properties/groups
   * in a group/account within a given time range.
   *
   * @param  {object}  options Options that get piped into SQL queries
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getTotal(options) {
    let queries = [
      this.getEgressTotal(options),
      this.getSPEgressTotal(options)
    ];

    return Promise.all(queries)
      .then((queryData) => {
        if (queryData[0][0].timestamp === null) {
          return queryData[1];
        } else {
          return queryData[0]
        }
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get outbound traffic (egress) for a property, group, or account.
   *
   * @param  {object}  options           Options that get piped into an SQL query
   * @return {Promise}                   A promise that is fulfilled with the
   *                                     query results
   */
  getEgress(options) {
    let isListingChildren = !!options.list_children || false;
    let optionsFinal      = this._getQueryOptions(options);
    let accountLevel      = this._getAccountLevel(optionsFinal);
    let accountLevelData  = this.accountLevelFieldMap[accountLevel];
    let conditions        = [];
    let grouping          = [];
    let queryOptions      = [];
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
   * @return {Promise}                   A promise that is fulfilled with the query results
   */
  getEgressWithHistorical(options) {
    let optionsFinal    = this._getQueryOptions(options);
    let start           = parseInt(optionsFinal.start);
    let end             = parseInt(optionsFinal.end);
    let duration        = end - start + 1;
    let optionsHistoric = Object.assign({}, optionsFinal, {
      start: start - duration,
      end: start - 1
    });
    let queries = [
      this.getEgress(optionsFinal),
      this.getEgress(optionsHistoric)
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
    } else {
      conditions.push("AND (status_code LIKE '4%' OR status_code LIKE '5%')");
    }

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
      && conditions.push(this.accountLevelFieldMap.asset.where)
      && queryOptions.push(optionsFinal.asset);

    conditions.push('AND net_type IN ("on", "off")');
    conditions.push('AND service_type IN ("http", "https")');

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.sp_account.select},
        epoch_start as timestamp,
        net_type,
        sum(bytes) AS bytes
      FROM spc_global_day
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
  getContributionData(options) {
    let queries = [];

    queries.push(this.getContributionTraffic(options));
    queries.push(this.getContributionCountryTraffic(options));
    queries.push(this.getContributionTrafficTotal(options));

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
   * Shared logic for the query options for the three contribution queries.
   */
  _buildContributionQueryOptions(optionsFinal) {
    let queryOptions     = [];
    let conditions       = [];

    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // CP Entity
    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.property
      && conditions.push(this.accountLevelFieldMap.property.where)
      && queryOptions.push(optionsFinal.property);

    // SP Entity
    optionsFinal.sp_account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.sp_account);

    optionsFinal.sp_group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.sp_group);

    optionsFinal.asset
      && conditions.push(this.accountLevelFieldMap.asset.where)
      && queryOptions.push(optionsFinal.asset);

    // SP IDs
    optionsFinal.sp_account_ids
      && conditions.push(this.accountLevelFieldMap.sp_account.whereIn)
      && queryOptions.push(optionsFinal.sp_account_ids);

    optionsFinal.sp_group_ids
      && conditions.push(this.accountLevelFieldMap.sp_group.whereIn)
      && queryOptions.push(optionsFinal.sp_group_ids);

    // CP IDs
    optionsFinal.account_ids
      && conditions.push(this.accountLevelFieldMap.account.whereIn)
      && queryOptions.push(optionsFinal.account_ids);

    optionsFinal.group_ids
      && conditions.push(this.accountLevelFieldMap.group.whereIn)
      && queryOptions.push(optionsFinal.group_ids);

    optionsFinal.properties
      && conditions.push(this.accountLevelFieldMap.property.whereIn)
      && queryOptions.push(optionsFinal.properties);

    // Other filters
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

    return {
      queryOptions: queryOptions,
      conditions: conditions
    }
  }

  /**
   * Get traffic information for a CP account broken down by service provider, or vice-versa.
   * Data is filtered by service type, and net type.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getContributionTraffic(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryVars        = this._buildContributionQueryOptions(optionsFinal);

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.account.select},
        ${this.accountLevelFieldMap.group.select},
        ${this.accountLevelFieldMap.property.select},
        ${this.accountLevelFieldMap.sp_account.select},
        ${this.accountLevelFieldMap.sp_group.select},
        ${this.accountLevelFieldMap.asset.select},
        net_type,
        service_type,
        sum(bytes) AS bytes
      FROM spc_global_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${queryVars.conditions.join('\n        ')}
      GROUP BY
        ${this.accountLevelFieldMap[optionsFinal.groupingEntity].field},
        net_type,
        service_type;
    `;

    return this._executeQuery(queryParameterized, queryVars.queryOptions);
  }

  /**
   * Get traffic information for a CP account broken down by service provider and country.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getContributionCountryTraffic(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryVars        = this._buildContributionQueryOptions(optionsFinal);

    let queryParameterized = `
      SELECT
        ${this.accountLevelFieldMap.sp_account.select},
        ${this.accountLevelFieldMap.sp_group.select},
        ${this.accountLevelFieldMap.asset.select},
        ${this.accountLevelFieldMap.account.select},
        ${this.accountLevelFieldMap.group.select},
        ${this.accountLevelFieldMap.property.select},
        country,
        sum(bytes) AS bytes
      FROM spc_country_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${queryVars.conditions.join('\n        ')}
      GROUP BY
        ${this.accountLevelFieldMap[optionsFinal.groupingEntity].field},
        country;
    `;

    return this._executeQuery(queryParameterized, queryVars.queryOptions);

  }

  /**
   * Get the total number of bytes limited by account, group, property,
   * sp account(s), net type, and/or service type.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getContributionTrafficTotal(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queryVars        = this._buildContributionQueryOptions(optionsFinal);

    let queryParameterized = `
      SELECT
        sum(bytes) AS bytes
      FROM spc_global_day
      WHERE timezone = 'UTC'
        AND epoch_start BETWEEN ? and ?
        ${queryVars.conditions.join('\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryVars.queryOptions);

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
      && conditions.push(this.accountLevelFieldMap.asset.where)
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
      FROM spc_global_day
      WHERE timezone = "UTC"
        AND epoch_start BETWEEN ? AND ?
        ${conditions.join('\n        ')};
    `;

    return this._executeQuery(queryParameterized, queryOptions);
  }

  /**
   * Get a bunch of different metrics to support the SP Dashboard.
   *
   * @param  {object}  options Options that get piped into an SQL query
   * @return {Promise}         A promise that is fulfilled with the query results
   */
  getSpDashboardMetrics(options) {
    let optionsFinal     = this._getQueryOptions(options);
    let queries          = [];
    let queryOptions     = [];
    let conditions       = [];

    // Build the table name
    queryOptions.push(optionsFinal.start);
    queryOptions.push(optionsFinal.end);

    // Build the WHERE clause
    optionsFinal.account
      && conditions.push(this.accountLevelFieldMap.sp_account.where)
      && queryOptions.push(optionsFinal.account);

    optionsFinal.group
      && conditions.push(this.accountLevelFieldMap.sp_group.where)
      && queryOptions.push(optionsFinal.group);

    optionsFinal.granularity === 'day'
      && conditions.push('AND timezone = "UTC"')

    // Global Data Query
    let globalQueryParameterized = `
      SELECT
        epoch_start as timestamp,
        ${this.accountLevelFieldMap.sp_account.select},
        ${this.accountLevelFieldMap.sp_group.select},
        sum(bytes) as bytes,
        sum(connections) as connections,
        round(sum(connections * chit_ratio) / sum(connections) * 100) as chit_ratio,
        round(sum(connections * avg_fbl) / sum(connections)) as avg_fbl,
        net_type
      FROM spc_global_${optionsFinal.granularity}
      WHERE epoch_start BETWEEN ? AND ?
        ${conditions.join('\n        ')}
      GROUP BY epoch_start, net_type
      ORDER BY epoch_start;
    `;

    // Country Data Query
    let countryQueryParameterized = `
      SELECT
        epoch_start as timestamp,
        country as code,
        ${this.accountLevelFieldMap.sp_account.select},
        ${this.accountLevelFieldMap.sp_group.select},
        sum(bytes) as bytes
      FROM spc_country_${optionsFinal.granularity}
      WHERE epoch_start BETWEEN ? AND ?
        ${conditions.join('\n        ')}
      GROUP BY country;
    `;

    // Provider Data Query
    let providerQueryParameterized = `
      SELECT
        epoch_start as timestamp,
        ${this.accountLevelFieldMap.account.select},
        sum(bytes) as bytes
      FROM spc_global_${optionsFinal.granularity}
      WHERE epoch_start BETWEEN ? AND ?
        ${conditions.join('\n        ')}
      GROUP BY epoch_start, ${this.accountLevelFieldMap.account.field}
      ORDER BY epoch_start;
    `;

    queries.push(this._executeQuery(globalQueryParameterized, queryOptions));
    queries.push(this._executeQuery(countryQueryParameterized, queryOptions));
    queries.push(this._executeQuery(providerQueryParameterized, queryOptions));

    return Promise.all(queries)
      .then((queryData) => {
        log.info(`Successfully received data from ${queryData.length} queries.`);
        return queryData;
      })
      .catch((err) => log.error(err));
  }

  /**
   * Get data stored in the schema_info table
   */
  getSchemaInfo() {
    return this._executeQuery('SELECT * FROM schema_info;');
  }

}

module.exports = new AnalyticsDB(configs);
