'use strict';

const _ = require('lodash');

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

}

module.exports = new DataUtils();
