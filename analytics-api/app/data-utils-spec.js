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
