'use strict';

require('express-jsend');
let _         = require('lodash');
let dataUtils = require('../data-utils');
let db        = require('../db');
let log       = require('../logger');

function computeGeoTraffic(options) {

  options.maxAreas = options.maxAreas || 5;

  let opts = {
    start           : options.params.start,
    end             : options.params.end,
    account         : options.params.account,
    group           : options.params.group,
    property        : options.params.property,
    service_type    : options.params.service_type,
    granularity     : options.params.granularity,
    country_code    : options.params.country_code,
    latitude_south  : options.params.latitude_south,
    longitude_west  : options.params.longitude_west,
    latitude_north  : options.params.latitude_north,
    longitude_east  : options.params.longitude_east,
    include_geo     : options.params.include_geo,
    geo_resolution  : options.geo_resolution,
    dimension       : options.geo_resolution[options.geo_resolution.length-1]
  };

  // if you've limited results by geo coords, then we'll assume you want geo (and we also need the table joined to do the
  // filter so this is the easiest way to be sure).
  if (opts.latitude_south || opts.latitude_north || opts.longitude_west || opts.longitude_east) opts.include_geo = true;

  db.getDataForGeo(opts).spread((trafficData, historicalTrafficData, spTrafficData, spHistoricalTrafficData) => {
    let responseData = {
      total: 0
    };
    responseData[options.areasName] = [];

    if (trafficData && historicalTrafficData) {
      trafficData = trafficData.concat(spTrafficData);
      historicalTrafficData = historicalTrafficData.concat(spHistoricalTrafficData);

      let optionsFinal                = db._getQueryOptions(opts);
      let allGeoTrafficData           = _.groupBy(trafficData,           (r) => { let components = []; for (let i = opts.geo_resolution.length; i; --i) components.push(r[opts.geo_resolution[i-1]]); return components.join(', '); });
      let allHistoricalGeoTrafficData = _.groupBy(historicalTrafficData, (r) => { let components = []; for (let i = opts.geo_resolution.length; i; --i) components.push(r[opts.geo_resolution[i-1]]); return components.join(', '); });

      _.forOwn(allGeoTrafficData, (areaData, areaKey) => {
        let trafficRecords;
        let total = 0;
        let requests = 0;
        let historicalTotal = 0;
        let areaRecord = {
          // default name to areaKey;
          // let caller provide a record decorator if they wish to adjust (e.g., country)
          name: areaData[0][opts.geo_resolution[opts.geo_resolution.length-1]],
          percent_change: 0.10,
          percent_total: 0.20,
          historical_total: 0,
          total: 0,
          requests: 0,
          detail: []
        };
	// add fields further qualifying name
        for (let i = 0; i < (opts.geo_resolution.length - 1); ++i) {
          areaRecord[opts.geo_resolution[i]] = areaData[0][opts.geo_resolution[i]];
        }
        if (opts.include_geo) {
          areaRecord.lat = areaData[0].lat;
          areaRecord.lon = areaData[0].lon;
        }

        // Set the detail array on the areaRecord
        // Calculate total egress for the area
        // Remove the area key from each traffic record — since we're already
        // grouped by area, we don't need to transfer all that extra data
        // over the network.
        trafficRecords = areaData.map((data) => {
          total += data.bytes;
          requests += data.requests;
          return _.pick(data, ['bytes', 'timestamp', 'requests']);
        });

        // Ensure there is a record for each time interval
        trafficRecords = dataUtils.buildContiguousTimeline(
          trafficRecords,
          optionsFinal.start,
          optionsFinal.end,
          optionsFinal.granularity,
          ['bytes', 'requests']
        );

        // Add bits per second to each traffic record
        trafficRecords = trafficRecords.map((record) => {
          record.bits_per_second = dataUtils.getBPSFromBytes(record.bytes, optionsFinal.granularity);
          return record;
        });

        // Save the area total to the areaRecord
        areaRecord.total = total;

        // Save the total area requests to the areaRecord
        areaRecord.requests = requests;

        // Save total bits per second to the areaRecord
        areaRecord.bits_per_second = Math.round((total * dataUtils.bitsPerByte) / (optionsFinal.end - optionsFinal.start));

        // Save average bits per second to the areaRecord
        let populatedTrafficBytes = trafficRecords
          .filter((record) => record.bytes !== null)
          .map((record) => record.bytes);
        let averageBytes = _.mean(populatedTrafficBytes);
        areaRecord.average_bits_per_second = dataUtils.getBPSFromBytes(averageBytes, optionsFinal.granularity);
        areaRecord.average_bytes = Math.round(averageBytes);

        // Add to the total traffic amount for all countries
        responseData.total += total;

        // Sum the historical traffic
        if (allHistoricalGeoTrafficData[areaKey]) {
          historicalTotal = allHistoricalGeoTrafficData[areaKey].reduce((runningTotal, currentRecord) => {
            return runningTotal + currentRecord.bytes;
          }, 0);
        }

        // Save the historical total to the areaRecord
        areaRecord.historical_total = historicalTotal;

        // Calculate percent change
        areaRecord.percent_change = parseFloat(((total - historicalTotal) / historicalTotal).toFixed(4));

        areaRecord.detail = trafficRecords;

	// Allow caller to provide additional per record processing
        if (options.decorateRecord) options.decorateRecord(areaRecord, areaKey);

        // Add the areaRecord to the response data
        responseData[options.areasName].push(areaRecord);

      });

      // Calculate percent total for each area
      responseData[options.areasName].forEach((areaRecord) => {
        areaRecord.percent_total = parseFloat((areaRecord.total / responseData.total).toFixed(4));
      });

      // Sort the countries by their total in descending order
      responseData[options.areasName] = _.sortBy(responseData[options.areasName], 'total').reverse();

      // Only include the number of countries specified by maxAreas
      responseData[options.areasName] = _.take(responseData[options.areasName], options.maxAreas);
    }

    if (options.success) options.success(responseData);

  }).catch((err) => {
    log.error(err);
    if (options.failure) options.failure(500, 'Database', 'There was a problem with the analytics database. Check the analytics-api logs for more information.');
  });

}

module.exports = computeGeoTraffic;
