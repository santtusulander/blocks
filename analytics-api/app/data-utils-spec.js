'use strict';

const dataUtils = require('./data-utils');

describe('dataUtils._getAppropriateTransferRateUnit', function() {
  let secondsPerGranularity = 3600;

  it('should return the Kb unit object if (transfer rate < 1 Mbps)', function() {
    let unit = dataUtils._getAppropriateTransferRateUnit(0, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Kb);

    unit = dataUtils._getAppropriateTransferRateUnit(449999999, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Kb);
  });

  it('should return the Mb unit object if (1 Mbps <= transfer rate < 1 Gbps)', function() {
    let unit = dataUtils._getAppropriateTransferRateUnit(450000000, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Mb);

    unit = dataUtils._getAppropriateTransferRateUnit(449999999999, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Mb);
  });

  it('should return the Gb unit object if (transfer rate >= 1 Gbps)', function() {
    let unit = dataUtils._getAppropriateTransferRateUnit(450000000000, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Gb);

    unit = dataUtils._getAppropriateTransferRateUnit(450000000001, secondsPerGranularity);
    expect(unit).toBe(dataUtils.units.Gb);
  });

});

describe('dataUtils.getTransferRatesFromBytes', function() {
  it('should return "1 Kbps" for 450000 bytes with a granularity of "hour"', function() {
    let transferRate = dataUtils.getTransferRatesFromBytes(450000, 'hour');
    expect(transferRate).toBe('1 Kbps');
  });

  it('should return "1 Mbps" for 450000000 bytes with a granularity of "hour"', function() {
    let transferRate = dataUtils.getTransferRatesFromBytes(450000000, 'hour');
    expect(transferRate).toBe('1 Mbps');
  });

  it('should return "1 Gbps" for 450000000000 bytes with a granularity of "hour"', function() {
    let transferRate = dataUtils.getTransferRatesFromBytes(450000000000, 'hour');
    expect(transferRate).toBe('1 Gbps');
  });

  it('should return null if an invalid time granularity was provided', function() {
    let transferRate = dataUtils.getTransferRatesFromBytes(450000000000, 'xxxx');
    expect(transferRate).toBe(null);
  });

});

describe('dataUtils.buildContiguousTimeline', function() {
  let jan1Start  = 1451606400;
  let jan31Start = 1454198400;
  let jan31End   = 1454284799;
  let feb1Start  = 1454284800;
  let feb1End    = 1454371199;
  let feb2Start  = 1454371200;
  let feb2End    = 1454457599;
  let feb3Start  = 1454457600;
  let feb3End    = 1454543999;
  let feb29End   = 1456790399;
  let dec31End   = 1483228799;
  let dataDaySingle = [{bytes: 10, timestamp: feb1Start}];
  let dataDayMissingMiddle = [
    {bytes: 10, timestamp: feb1Start},
    {bytes: 20, timestamp: feb3Start}
  ];

  it('should return the same number of records if there were no holes in the data', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, feb1Start, feb1End, 'day');
    expect(data.length).toBe(1);
  });

  it('should return extra records if there were holes in the leading edge of the data', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, jan31Start, feb1End, 'day');
    expect(data.length).toBe(2);
    expect(data[0].timestamp).toBe(jan31Start);
    expect(data[0].bytes).toBe(null);
    expect(data[1].timestamp).toBe(feb1Start);
    expect(data[1].bytes).toBe(10);
  });

  it('should return extra records if there were holes in the trailing edge of the data', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, feb1Start, feb2End, 'day');
    expect(data.length).toBe(2);
    expect(data[0].timestamp).toBe(feb1Start);
    expect(data[0].bytes).toBe(10);
    expect(data[1].timestamp).toBe(feb2Start);
    expect(data[1].bytes).toBe(null);
  });

  it('should return extra records if there were holes in the middle of the data', function() {
    let data = dataUtils.buildContiguousTimeline(dataDayMissingMiddle, feb1Start, feb3End, 'day');
    expect(data.length).toBe(3);
    expect(data[0].timestamp).toBe(feb1Start);
    expect(data[0].bytes).toBe(10);
    expect(data[1].timestamp).toBe(feb2Start);
    expect(data[1].bytes).toBe(null);
    expect(data[2].timestamp).toBe(feb3Start);
    expect(data[2].bytes).toBe(20);
  });

  it('should retain properties besides timestamp and bytes when pushing extra records', function() {
    let dataDaySingleModified = [Object.assign({}, dataDaySingle[0], {whatever: true})];
    let data = dataUtils.buildContiguousTimeline(dataDaySingleModified, feb1Start, feb2End, 'day');
    expect(data.length).toBe(2);
    expect(data[0].whatever).toBe(true);
    expect(data[1].whatever).toBe(true);
  });

  it('should return 288 records per day for the 5min granularity', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, feb1Start, feb1End, '5min');
    expect(data.length).toBe(288);
  });

  it('should return 24 records per day for the hour granularity', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, feb1Start, feb1End, 'hour');
    expect(data.length).toBe(24);
  });

  it('should return 31 records for Jan 2016 for the day granularity', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, jan1Start, jan31End, 'day');
    expect(data.length).toBe(31);
  });

  it('should return 29 records for Feb 2016 for the day granularity', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, feb1Start, feb29End, 'day');
    expect(data.length).toBe(29);
  });

  it('should return 12 records per year for the month granularity', function() {
    let data = dataUtils.buildContiguousTimeline(dataDaySingle, jan1Start, dec31End, 'month');
    expect(data.length).toBe(12);
  });

});
