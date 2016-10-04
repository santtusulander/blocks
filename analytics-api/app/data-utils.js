'use strict';

const _         = require('lodash');
const moment    = require('moment');
const countries = require('country-data').countries;

/**
 * @class
 * A collection of functions that help manipulate data returned from the database.
 * NOTE: This file exports an instance of this class, effectively making it a
 * singleton. This is intentional — we only ever need one instance of the utils.
 */
class DataUtils {

  /**
   * @constructor
   * Sets up instance properties that are effectivly used as constants.
   * They are publicly accessible instance properties so they can be
   * referenced from unit tests.
   */
  constructor() {
    this.units = {
      Kb: {bytesPerUnit: 125, unit: 'Kbps'},
      Mb: {bytesPerUnit: 125000, unit: 'Mbps'},
      Gb: {bytesPerUnit: 125000000, unit: 'Gbps'}
    };

    this.secondsPerGranularity = {
      '5min' : 300,
      hour   : 3600,
      day    : 86400,
      month  : 2629743 // 30.44 days
    };

    this.bitsPerByte = 8;
  }

  /**
   * Determine the appropriate transfer rate unit based on the number of bytes.
   *
   * @private
   * @param  {number} bytes                 The amount of bytes
   * @param  {string} secondsPerGranularity The number of seconds within a time granularity
   * @return {object}                       A unit object from the units property
   *                                        of the DataUtils instance (this.units)
   */
  _getAppropriateTransferRateUnit(bytes, secondsPerGranularity) {
    let appropriateUnit;
    let maxBytesKbps = (this.units.Mb.bytesPerUnit * secondsPerGranularity);
    let minBytesMbps = maxBytesKbps;
    let maxBytesMbps = (this.units.Gb.bytesPerUnit * secondsPerGranularity);

    if (bytes < maxBytesKbps) {
      appropriateUnit = this.units.Kb;

    // NOTE: _.inRange is inclusive on the start of the range, but not the end.
    } else if (_.inRange(bytes, minBytesMbps, maxBytesMbps)) {
      appropriateUnit = this.units.Mb;

    } else {
      appropriateUnit = this.units.Gb;
    }

    return appropriateUnit;
  }

  /**
   * Calculate transfer rates from bytes.
   *
   * @param  {object}        bytes       The number of bytes to convert to a transfer rate measurement.
   * @param  {string|number} granularity The time granularity used to figure out how many
   *                                     seconds the transfer amount should be divided by.
   *                                     Can also be passed as a number to divide by a specific number of seconds.
   * @return {string|null}               The transfer rate measurement including the unit.
   *                                     Returns null if the number couldn't be calculated.
   *                                     e.g. "10 Gbps"
   */
  getTransferRatesFromBytes(bytes, granularity) {
    let secondsPerGranularity = _.isNumber(granularity) ? granularity : this.secondsPerGranularity[granularity];
    let transferRateUnit      = this._getAppropriateTransferRateUnit(bytes, secondsPerGranularity);
    let bytesPerUnit          = transferRateUnit.bytesPerUnit;
    let transferRate          = parseFloat((bytes / bytesPerUnit / secondsPerGranularity).toFixed(2));

    return _.isNaN(transferRate) ? null : `${transferRate} ${transferRateUnit.unit}`;
  }

  /**
   * Calculate bits per second from bytes.
   *
   * @param  {object}        bytes       The number of bytes to convert to a transfer rate measurement.
   * @param  {string|number} granularity The time granularity used to figure out how many
   *                                     seconds the transfer amount should be divided by.
   *                                     Can also be passed as a number to divide by a specific number of seconds.
   * @return {number|null}               The average bits per second for the given time granularity.
   *                                     Returns null if bytes was passed as null.
   */
  getBPSFromBytes(bytes, granularity) {
    let secondsPerGranularity = _.isNumber(granularity) ? granularity : this.secondsPerGranularity[granularity];
    let bitsPerSecond = Math.round((bytes * this.bitsPerByte) / secondsPerGranularity);
    return (bytes === null) ? null : bitsPerSecond;
  }

  /**
   * Given an array of traffic records, return a new array that contains the
   * maximum number of records (based on the time granularity) possible within
   * the provided time range. Any times missing from the original array will
   * be represented by a null record. Check out the unit tests for more information.
   * NOTE: This function has a major and not so obvious flaw — it depends on the
   * start time being on a correct interval (start of month, start of day, start
   * of hour, or start of a 5 minute interval counted from the beginning of a day).
   * If the start time is incorrect, an array with almost all null traffic records
   * will be returned.
   * NOTE: A "null record" is still an object. It's the bytes property of the
   * object that will be null, like this: {bytes: null, timestamp: 1451606400}
   * NOTE: Any properties found on an existing traffic record (besides timestamp
   * and bytes) will be preserved for a null record, like this:
   * {bytes: null, timestamp: 1451606400, service_type: 'http'}
   * So, it's important that all the objects in the data array have the same
   * properties. The first record in the data array will be used as a template.
   *
   * @param  {array}        data         Array of traffic records
   * @param  {number}       start        Start of the time range as a UTC UNIX timestamp
   * @param  {number}       end          End of the time range as a UTC UNIX timestamp
   * @param  {string}       granularity  The time granularity (5min, hour, day, or month)
   * @param  {string|array} nullProperty The property of the object to set as null
   *                                     e.g. 'bytes' or ['bytes', 'uniq_vis']
   * @return {array}                     A new array with missing records populated
   *                                     by null records.
   */
  buildContiguousTimeline(data, start, end, granularity, nullProperty) {
    let finalData      = [];
    let interval       = granularity === '5min' ? 5 : 1;
    let unit           = granularity === '5min' ? 'minutes' : granularity;
    let startTime      = moment.unix(start).utc();
    let endTime        = moment.unix(end).utc();
    let currentTime    = moment(startTime);
    let dataGrouped    = _.groupBy(data, 'timestamp');
    let nullRecord     = {};
    let nullProperties = [];

    // Populate the nullRecord with the specified properties
    if (typeof nullProperty === 'string') {
      nullProperties = [nullProperty];
    } else if (_.isArray(nullProperty)) {
      nullProperties = nullProperty;
    }

    nullProperties.forEach((prop) => nullRecord[prop] = null);

    // Build the contiguous timeline
    while (currentTime.isBefore(endTime)) {
      let record;
      let matchingRecord = dataGrouped[currentTime.format('X')];
      let recordTemplate = data[0];

      // If a record already exists for this time, use it
      if (matchingRecord) {
        record = matchingRecord[0];

      // ...otherwise, push a null record
      } else {
        nullRecord.timestamp = parseFloat(currentTime.format('X'));
        record = Object.assign({}, recordTemplate, nullRecord);
      }

      // Push the record and increment currentTime
      finalData.push(record);
      currentTime.add(interval, unit);
    }

    return finalData;

  }

  /**
   * Build an array of objects that each represent a dimension item that contains
   * detailed unique visitor data, total visitor amount, and percent of total visitors.
   *
   * @param  {string} dimension     The name of the dimension (os, browser, or country)
   * @param  {array}  visitorData   An array of visitor data
   * @param  {object} totalsGrouped Total number of visitors grouped by dimension
   * @param  {number} grandTotal    Total number of visitors for all dimension items
   * @param  {number} max           The maximum number of records to return
   * @param  {object} options       The options object passed to the db method
   * @return {array}                An array of objects that each contain visitor
   *                                data for a dimension item
   */
  processVisitorDataByDimension(dimension, visitorData, totalsGrouped, grandTotal, max, options) {
    let records = [];
    let visitorDataGrouped = _.groupBy(visitorData, dimension);

    _.forOwn(visitorDataGrouped, (data, dimensionName) => {
      let visitorRecords;
      let dimensionTotal = (totalsGrouped && totalsGrouped[dimensionName] && totalsGrouped[dimensionName][0] && totalsGrouped[dimensionName][0].uniq_vis) || 0;
      let record = {
        name: dimensionName,
        percent_total: parseFloat((dimensionTotal / grandTotal).toFixed(4)) || 0,
        total: dimensionTotal,
        detail: []
      };

      // Don't include this record if the total is falsy or "0"
      if (!dimensionTotal || dimensionTotal === '0') {
        return;
      }

      // Set the detail array on the record
      // Calculate total visitors for the dimension
      // Remove the dimension key from each record — since we're already
      // grouped by dimension, we don't need to transfer all that extra data
      // over the network.
      visitorRecords = data.map((data) => {
        return _.pick(data, ['timestamp', 'uniq_vis']);
      });

      // Ensure there is a record for each time interval
      visitorRecords = this.buildContiguousTimeline(
        visitorRecords, options.start, options.end, options.granularity, 'uniq_vis'
      );
      record.detail = visitorRecords;

      // Add the record to the response data
      records.push(record);

    });

    // Sort the browsers by their total in descending order
    records = _.sortBy(records, 'total').reverse();

    // Only include the number of browsers specified by the max argument
    records = _.take(records, max);

    return records;
  }

  /**
   * Given a case insensitive country code, return the country name.
   * @param  {string} code  The 2 or 3 character country code, e.g. US, us, USA, usa
   * @return {string}       The country name, e.g. United States
   */
  getCountryNameFromCode(code) {
    code = countries[code] ? code : code.toUpperCase();
    return countries[code] ? countries[code].name : code;
  }

  /**
   * Given a case insensitive country code, return the three character country code.
   * @param  {string} code  The 2 or 3 character country code, e.g. US, us, USA, usa
   * @return {string}       The uppercase 3 character country code, e.g. USA
   */
  get3CharCountryCodeFromCode(code) {
    code = countries[code] ? code : code.toUpperCase();
    return countries[code] ? countries[code].alpha3 : code;
  }

  /**
   * Get the grouping entity based on the params passed. This is used to figure
   * out how to group data for the contribution report endpoints.
   * @param  {object} options  The options object from the endpoint.
   * @return {string}
   */
  getGroupingEntityForContributionReport(options) {
    let groupingEntity;

    // For cp-contribution
    if (options.properties) {
      groupingEntity = 'property';
    } else if (options.group_ids) {
      groupingEntity = 'group'
    } else if (options.account_ids) {
      groupingEntity = 'account'

    // For sp-contribution
    } else if (options.assets) {
      groupingEntity = 'asset'
    } else if (options.sp_group_ids) {
      groupingEntity = 'sp_group'
    } else if (options.sp_group_ids) {
      groupingEntity = 'sp_account'

    // Catch-all for sp-contribution
    } else if (options.account) {
      groupingEntity = 'sp_account'

    // Catch-all for cp-contribution
    } else if (options.sp_account) {
      groupingEntity = 'account'
    }

    return groupingEntity;
  }

  /**
   * Process data for the SP and CP contribution reports.
   */
  processContributionData(duration, groupingEntity, trafficData, countryData, totalBytes) {
    let finalTrafficData = [];
    let trafficDataGrouped = _.groupBy(trafficData, groupingEntity);
    let countryDataGrouped = _.groupBy(countryData, groupingEntity);

    _.forOwn(trafficDataGrouped, (data, entity_id) => {
      let record = {};

      // HTTP traffic
      let httpTraffic       = _.filter(data, {service_type: 'http'});
      let httpOnNetTraffic  = _.find(httpTraffic, {net_type: 'on'});
      let httpOffNetTraffic = _.find(httpTraffic, {net_type: 'off'});
      let httpOnNetBytes    = _.get(httpOnNetTraffic, 'bytes', null);
      let httpOffNetBytes   = _.get(httpOffNetTraffic, 'bytes', null);

      // HTTPS traffic
      let httpsTraffic       = _.filter(data, {service_type: 'https'});
      let httpsOnNetTraffic  = _.find(httpsTraffic, {net_type: 'on'});
      let httpsOffNetTraffic = _.find(httpsTraffic, {net_type: 'off'});
      let httpsOnNetBytes    = _.get(httpsOnNetTraffic, 'bytes', null);
      let httpsOffNetBytes   = _.get(httpsOffNetTraffic, 'bytes', null);

      record.account = _.get(data, '0.account', null);
      record.group = _.get(data, '0.group', null);
      record.property = _.get(data, '0.property', null);
      record.sp_account = _.get(data, '0.sp_account', null);
      record.sp_group = _.get(data, '0.sp_group', null);
      record.asset = _.get(data, '0.asset', null);

      record.http = {
        net_on_bytes: httpOnNetBytes,
        net_off_bytes: httpOffNetBytes,
        net_on_bps: this.getBPSFromBytes(httpOnNetBytes, duration),
        net_off_bps: this.getBPSFromBytes(httpOffNetBytes, duration)
      };

      record.https = {
        net_on_bytes: httpsOnNetBytes,
        net_off_bytes: httpsOffNetBytes,
        net_on_bps: this.getBPSFromBytes(httpsOnNetBytes, duration),
        net_off_bps: this.getBPSFromBytes(httpsOffNetBytes, duration)
      };

      record.countries = countryDataGrouped[entity_id].map(countryRecord => {
        return {
          name: this.getCountryNameFromCode(countryRecord.country),
          code: this.get3CharCountryCodeFromCode(countryRecord.country),
          bytes: countryRecord.bytes,
          bits_per_second: this.getBPSFromBytes(countryRecord.bytes, duration),
          percent_total: parseFloat((countryRecord.bytes / totalBytes).toFixed(4))
        }
      });

      finalTrafficData.push(record);
    })

    return finalTrafficData;
  }

}

module.exports = new DataUtils();
