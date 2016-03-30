'use strict';

const _      = require('lodash');
const moment = require('moment');

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
   * @param  {object} bytes       The number of bytes to convert to a transfer rate measurement.
   * @param  {string} granularity The time granularity used to figure out how many
   *                              seconds the transfer amount should be divided by.
   * @return {string|null}        The transfer rate measurement including the unit.
   *                              Returns null if the number couldn't be calculated.
   *                              e.g. "10 Gbps"
   */
  getTransferRatesFromBytes(bytes, granularity) {
    let secondsPerGranularity = this.secondsPerGranularity[granularity];
    let transferRateUnit      = this._getAppropriateTransferRateUnit(bytes, secondsPerGranularity);
    let bytesPerUnit          = transferRateUnit.bytesPerUnit;
    let transferRate          = parseFloat((bytes / bytesPerUnit / secondsPerGranularity).toFixed(2));

    return _.isNaN(transferRate) ? null : `${transferRate} ${transferRateUnit.unit}`;
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
   * @param  {array}  data         Array of traffic records
   * @param  {number} start        Start of the time range as a UTC UNIX timestamp
   * @param  {number} end          End of the time range as a UTC UNIX timestamp
   * @param  {string} granularity  The time granularity (5min, hour, day, or month)
   * @param  {string} nullProperty The property of the object to set as null
   *                               e.g. 'bytes' or 'uniq_vis'
   * @return {array}               A new array with missing records populated
   *                               by null records.
   */
  buildContiguousTimeline(data, start, end, granularity, nullProperty) {
    let finalData   = [];
    let interval    = granularity === '5min' ? 5 : 1;
    let unit        = granularity === '5min' ? 'minutes' : granularity;
    let startTime   = moment.unix(start).utc();
    let endTime     = moment.unix(end).utc();
    let currentTime = moment(startTime);
    let dataGrouped = _.groupBy(data, 'timestamp');
    let nullRecord  = {};

    nullRecord[nullProperty] = null;

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

}

module.exports = new DataUtils();
