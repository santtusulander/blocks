import { HmacMD5, HmacSHA1, HmacSHA256, MD5, enc } from 'crypto-js'

import { SCHEMA_LABEL_MAP, STATIC_TOKEN_SAMPLE_VALUES } from '../constants/configuration'

export const generateStaticTokenTableData = (schema, values) => (
  schema.map(item => (
    {
      labelID: SCHEMA_LABEL_MAP[item],
      value: values[item] || STATIC_TOKEN_SAMPLE_VALUES[item],
      schemaKey: item
    }
  ))
)

export const generateTokenData = (schema, values) => (
  schema.reduce((tokenDataString, item) => {
    switch (item) {
      case 'EXPIRES':
        tokenDataString = `${tokenDataString}expires=${values[item] || STATIC_TOKEN_SAMPLE_VALUES[item]}`
        break
      default :
        tokenDataString = `${tokenDataString}${values[item] || STATIC_TOKEN_SAMPLE_VALUES[item]}`
    }
    return tokenDataString
  }, '')
)

export const generateTokenHash = (method, key, string) => {
  switch (method) {
    case 'HMAC_MD5':
      return HmacMD5(string, key).toString(enc.Hex)
    case 'HMAC_SHA1':
      return HmacSHA1(string, key).toString(enc.Hex)
    case 'HMAC_SHA256':
      return HmacSHA256(string, key).toString(enc.Hex)
    case 'MD5':
      return MD5(string).toString(enc.Hex)
  }
}
