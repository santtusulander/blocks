# API SQL Queries
A list of queries and sample responses used by the analytics API.

## Traffic Over Time
The API will accept parameters that will allow the caller to filter the data by `account_id`, `group_id`, `property`, `dimension`, `granularity`, `service_type`, and `flow_dir`.

### Table Name Construction
The `account_id`, `group_id`, `property`, `dimension`, and `granularity` parameters passed to the API will be used to determine which table to query. The tables are named using the following format: `level_dimension_granularity`.

#### Account Level
The combination of values for `account_id`, `group_id`, and `property` will determine the account level. Assuming `granularity=hour` and `dimension=global`, the following tables will be queried:
- `account_global_hour` — If only `account_id` is provided
- `group_global_hour` — If only `account_id` and `group_id` are provided
- `property_global_hour` — If `account_id`, `group_id`, and `property` are provided

**NOTE:** It is assumed that a `property` can't be provided without also providing an `account_id` and `group_id`. Similarly, a `group_id` can't be provided without also providing an `account_id`. An `account_id` will be required as a minimum.

#### Dimension
For now, traffic data can only be returned by geographic level (not device). So, the only valid `dimension` values will be `global`, `country`, `region`, and `city`. These values map directly to that portion of the table name.

Assuming `granularity=hour` and `account_id=1`, the following tables will be queried:
- `account_global_hour` — If `dimension=global`
- `account_country_hour` — If `dimension=country`
- `account_region_hour` — If `dimension=region`
- `account_city_hour` — If `dimension=city`

#### Granularity
The `granularity` will determine how much data is returned by the API. The only valid `granularity` values will be `month`, `day`, `hour`, and `5min`.

Assuming `dimension=global` and `account_id=1`, the following tables will be queried:
- `account_global_month` — If `granularity=month`
- `account_global_day` — If `granularity=day`
- `account_global_hour` — If `granularity=hour`
- `account_global_5min` — If `granularity=5min`

### Query
```sql
SELECT
  epoch_start,
  service_type,
  flow_dir,
  bytes
FROM property_global_hour
WHERE epoch_start BETWEEN 1451606400 AND 1454284799 # 2016-01-01 - 2016-01-31
  AND account_id = 3
  AND group_id = 3
  AND property = 'idean.com'
ORDER BY
  epoch_start ASC,
  service_type ASC,
  flow_dir ASC;
```

### Sample Results
| epoch_start | service_type | flow_dir | bytes      |
|-------------|--------------|----------|------------|
| 1451606400  | http         | in       | 3283740535 |
| 1451606400  | http         | mid      | 2549486221 |
| 1451606400  | http         | out      | 1007773065 |
| 1451606400  | https        | in       | 4014573055 |
| 1451606400  | https        | mid      | 6152170394 |
| 1451606400  | https        | out      | 8791420315 |
| 1451610000  | http         | in       | 1832900836 |
| 1451610000  | http         | mid      | 378271640  |
| 1451610000  | http         | out      | 436853975  |
| 1451610000  | https        | in       | 7448553625 |
| 1451610000  | https        | mid      | 4241136223 |
| 1451610000  | https        | out      | 2646179660 |
