'use strict';

let _              = require('lodash');
let dataUtils      = require('../../data-utils');
let lowerByteLimit = 10000000000;    // 10 GB
let upperByteLimit = 10000000000000; // 10,000 GB

/**
 * Build a net_on/net_off record that includes bytes and percent_total.
 *
 * @param  {number} bytes The amount of bytes for net_on/net_off
 * @param  {number} total The total amount of bytes for net_on and net_off
 * @return {object}       An object that contains the bytes and percent_total
 */
function buildRecord(bytes, total) {
  return {
    bytes: bytes,
    percent_total: parseFloat((bytes / total).toFixed(4))
  }
}

module.exports = function testData(options) {
  let data = {};

  // Fill the detail with the appropriate number of time records
  data.detail = dataUtils.buildContiguousTimeline(
    [],
    options.start,
    options.end,
    options.granularity,
    'total'
  );

  let grandTotal       = 0;
  let grandTotalNetOn  = 0;
  let grandTotalNetOff = 0;

  // Fill in extra data in each detail record
  data.detail = data.detail.map((record) => {
    let totalNetOn  = _.random(lowerByteLimit, upperByteLimit);
    let totalNetOff = _.random(lowerByteLimit, upperByteLimit);
    let total = totalNetOn + totalNetOff;

    // Increment the grand totals
    grandTotal       += total;
    grandTotalNetOn  += totalNetOn;
    grandTotalNetOff += totalNetOff;

    // Save the detail records to the data object
    // NOTE: the timestamp property already exists on each of the detail records
    record.total   = total;
    record.net_on  = buildRecord(totalNetOn, total);
    record.net_off = buildRecord(totalNetOff, total);

    return record;
  });

  // Save the grand totals to the data object
  data.total   = grandTotal;
  data.net_on  = buildRecord(grandTotalNetOn, grandTotal);
  data.net_off = buildRecord(grandTotalNetOff, grandTotal);

  return data;
};


// module.exports = {
//   total: 31000000,
//   net_on: {bytes: 15500000, percent_total: 0.5},
//   net_off: {bytes: 15500000, percent_total: 0.5},
//   detail: [{
//     timestamp: 1451606400,
//     total: 1000000,
//     net_on: {bytes: 500000, percent_total: 0.5},
//     net_off: {bytes: 500000, percent_total: 0.5}
//   }, {
//     timestamp: 1451692800,
//     total: 1000000,
//     net_on: {bytes: 500000, percent_total: 0.5},
//     net_off: {bytes: 500000, percent_total: 0.5}
//   }]
// };

// January timestamps
// 1451606400
// 1451692800
// 1451779200
// 1451865600
// 1451952000
// 1452038400
// 1452124800
// 1452211200
// 1452297600
// 1452384000
// 1452470400
// 1452556800
// 1452643200
// 1452729600
// 1452816000
// 1452902400
// 1452988800
// 1453075200
// 1453161600
// 1453248000
// 1453334400
// 1453420800
// 1453507200
// 1453593600
// 1453680000
// 1453766400
// 1453852800
// 1453939200
// 1454025600
// 1454112000
// 1454198400
