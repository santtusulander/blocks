'use strict';

const _       = require('lodash');
const moment  = require('moment');
const fs      = require('fs');

const numAccounts = 4;
const numGroupsPerAccount = 3;
const numPropertiesPerGroup = 3;

const minBytes = 108000000000000;
const maxBytes = 270000000000000;
const minRequests = 100;
const maxRequests = 9999;
const minConnections = 100;
const maxConnections = 1000;
const minFBL = 7;
const maxFBL = 50;
const minCHR = 0.10;
const maxCHR = 0.95;
const minVisitors = 10;
const maxVisitors = 500;
const minDate = moment('2016-01-01');
const maxDate = moment('2016-04-01');

// TODO: Use this data instead of using ideices for accounts, groups, and properties.
// This means that we'd have to not treat account, group, and property as "groupable" fields.
// console.log(`Building fake account data for ${numAccounts} accounts, each with ${numGroupsPerAccount} groups, each with ${numPropertiesPerGroup} properties.`);
// const accounts = (function(){
//
//   // Build accounts
//   let accountData = [];
//   for (let accountIndex = 1; accountIndex <= numAccounts; accountIndex++) {
//
//     // Build groups
//     let groups = [];
//     for (let groupIndex = 1; groupIndex <= numGroupsPerAccount; groupIndex++) {
//
//       // Build properties
//       let properties = [];
//       for (let propertyIndex = 1; propertyIndex <= numPropertiesPerGroup; propertyIndex++) {
//         properties.push(`www.a${accountIndex}g${groupIndex}p${propertyIndex}.com`);
//       }
//
//       groups.push({
//         group_id: groupIndex,
//         name: `Group ${groupIndex}`,
//         properties: properties
//       });
//     }
//
//     accountData.push({
//       account_id: accountIndex,
//       account_name: `Account ${accountIndex}`,
//       groups: groups
//     });
//   }
//
//   return accountData;
//
// })();

const commonFields = {
  service_type : ['http', 'https'],
  flow_dir     : ['in', 'out', 'mid'],
  bytes        : () => _.random(minBytes, maxBytes),
  requests     : () => _.random(minRequests, maxRequests),
  connections  : () => _.random(minConnections, maxConnections),
  avg_fbl      : () => _.random(minFBL, maxFBL),
  chit_ratio   : () => _.random(minCHR, maxCHR),
  uniq_vis     : () => _.random(minVisitors, maxVisitors)
};

const otherFields = {
  browser : ['IE9', 'IE10', 'IE11', 'Edge', 'Chrome', 'Firefox', 'Safari'],
  country : ['US', 'FI', 'MX', 'CA', 'GB', 'AU', 'IN', 'FR', 'DE', 'IT'],
  os      : ['OS X', 'Windows 7', 'Windows 8', 'Windows 8.1', 'Windows 10', 'Ubuntu', 'Chrome OS']
}

const accountIndices  = _.fill(Array(numAccounts), 0).map((value, index) => index + 1);
const groupIndices    = _.fill(Array(numGroupsPerAccount), 0).map((value, index) => index + 1);
const propertyIndices = _.fill(Array(numPropertiesPerGroup), 0).map((value, index) => index + 1);

const levels = {
  'account': {
    fields: {account_id: accountIndices}
  },
  'group': {
    fields: {
      account_id: accountIndices,
      group_id: groupIndices
    }
  },
  'property': {
    fields: {
      account_id : accountIndices,
      group_id   : groupIndices,
      property   : propertyIndices
    }
  }
};

const dimensions = {
  'browser': {
    fields: Object.assign(
      {},
      _.pick(commonFields, ['uniq_vis']),
      _.pick(otherFields, ['browser'])
    )
  },
  'country': {
    fields: Object.assign(
      {},
      commonFields,
      _.pick(otherFields, ['country'])
    )
  },
  'global': {fields: Object.assign({}, commonFields)},
  'os': {
    fields: Object.assign(
      {},
      _.pick(commonFields, ['uniq_vis']),
      _.pick(otherFields, ['os'])
    )
  }
};

const granularities = {
  // '5min'  : {fields: {epoch_start: generateTimeRange(5, 'minutes')}},
  'hour'  : {fields: {epoch_start: generateTimeRange(1, 'hours')}},
  'day'   : {fields: {epoch_start: generateTimeRange(1, 'days'), timezone: 'UTC'}},
  'month' : {fields: {epoch_start: generateTimeRange(1, 'months'), timezone: 'UTC'}}
};



generateAllData();



// Create a CSV file for each table
// NOTE: There is one table per level, per dimension, per granularity
function generateAllData() {
  let startTime  = moment();
  let tableCount = _.keys(levels).length * _.keys(dimensions).length * _.keys(granularities).length;
  let tableIndex = 0;
  let tableDoneCount = 0;

  console.log(`Creating files for ${tableCount} tables\n`);

  // This iteration gets us a list of all the files to create
  _.forOwn(levels, (level, levelName) => {
    _.forOwn(dimensions, (dimension, dimensionName) => {
      _.forOwn(granularities, (granularity, granularityName) => {

        let tableName      = `${levelName}_${dimensionName}_${granularityName}`;

        // Based on the current level, dimension, and granularity, make an object
        // of fields that this file/table should contain.
        let fields         = Object.assign({}, level.fields, dimension.fields, granularity.fields);
        let writeStream    = fs.createWriteStream(`output/${tableName}.csv`);
        let fieldNames     = [];

        // Groupable fields are fields with array values
        // NOTE: We push to fieldNames to ensure consistent ordering of fields names and values
        let groupableFields = _.map(_.pickBy(fields, _.isArray), (field, fieldName) => {
          fieldNames.push(fieldName);
          return field;
        });

        // Normal fields are fields with non-array values
        // NOTE: We push to fieldNames to ensure consistent ordering of fields names and values
        let normalFields = _.map(_.omitBy(fields, _.isArray), (field, fieldName) => {
          fieldNames.push(fieldName);
          return field;
        });

        writeStream.on('open', () => {
          let tableStartTime = moment();
          console.log(`Creating file for table #${++tableIndex}: ${tableName}.csv`);
          console.log(process.memoryUsage());

          // Keep track of how many files have been created so we know when the job is done
          tableDoneCount++;

          // Write the first line into the file: the list of fields
          writeStream.write(fieldNames.join(',') + '\n');

          // Start recursion — generate all the records
          generateTableData([], 0, groupableFields, normalFields, writeStream);

          // File has been fully created at this point
          writeStream.end();
          console.log(`  - output records to table #${tableDoneCount} in ${moment().diff(tableStartTime, 'milliseconds')} milliseconds\n`);

          if (tableDoneCount === tableCount) {
            console.log(`All files created in ${moment().diff(startTime, 'seconds')} seconds`);
          }
        });


      });
    });
  });
}


function generateTableData(record, depth, gFields, nFields, writeStream) {
  gFields = gFields.slice(0);
  record = depth === 0 ? [] : (record || []);
  let currentField = gFields.shift();

  currentField.forEach((gFieldValue) => {
    record[depth] = gFieldValue;

    if (gFields.length === 0) {
      nFields.forEach((nFieldValue, nFieldIndex) => {
        nFieldValue = (typeof nFieldValue === 'function') ? nFieldValue() : nFieldValue;
        record[depth + nFieldIndex + 1] = nFieldValue;
      });

      writeStream.write(record.join(',') + '\n');

    } else {
      generateTableData(record, depth + 1, gFields, nFields, writeStream);
    }
  });

}


function generateTimeRange(interval, unit) {
  let currentTime = moment(minDate);
  let range = [];

  while (currentTime.isBefore(maxDate)) {
    range.push(currentTime.format('X'));
    currentTime.add(interval, unit);
  }

  return range;
}
