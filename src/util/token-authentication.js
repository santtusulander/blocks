import { SCHEMA_LABEL_MAP, STATIC_TOKEN_SAMPLE_VALUES } from '../constants/configuration'

export const generateStaticTokenTableData = (schema) => (
  schema.map(item => (
    {
      labelID: SCHEMA_LABEL_MAP[item],
      value: String(STATIC_TOKEN_SAMPLE_VALUES[item]),
      schemaKey: item
    }
  ))
)
