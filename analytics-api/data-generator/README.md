# Analytic Data Generator
This is a node script that will generate test data as CSV files that can be imported into the analytics database.

## Running the Generator
From this directory run, `node data-generator`.

## THIS IS A WORK IN PROGRESS!
There are a bunch of configs in `data-generator.js` that determine how much data will be generated and what values will be populated.

The goal of this generator was to get some test data created, so there is a bunch of work that could be done on this generator to make it more stable, flexible, configurable, etc.

Some things that could be added to the generator:
- Delete all files in the output directory before generating new data.
- Figure out how to manage heap memory better. Currently, the process crashes when it tries to garbage collect when the process tries to exit. Also, I wasn't able to generate data for the `5min` tables because of the memory issues (the problem seems to be with the writeStream.write calls).
- Account, group, and property data are just indices — there's no way to specify which account, group, and property names/numbers are used.
- Create data for city and region tables.
