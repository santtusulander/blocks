import { HmacMD5, HmacSHA1, HmacSHA256, MD5, enc } from 'crypto-js'
import moment from 'moment'

import { SCHEMA_LABEL_MAP, STATIC_TOKEN_SAMPLE_VALUES } from '../constants/configuration'

export const generateStaticTokenTableData = (schema, values = STATIC_TOKEN_SAMPLE_VALUES) => (
  schema.map(item => {
    let value = values[item]
    if (item === 'EXPIRES') {
      value = moment(value).utc()
    }
    return {
      labelID: SCHEMA_LABEL_MAP[item],
      value,
      schemaKey: item
    }
  })
)

export const generateTokenData = (schema, values = STATIC_TOKEN_SAMPLE_VALUES) => (
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

export const generateFinalURL = (token, queryArguments) => {
  let finalURL = STATIC_TOKEN_SAMPLE_VALUES.URL
  if (finalURL.indexOf('http') !== 0) {
    finalURL = `http://${finalURL}`
  }
  finalURL = `${finalURL}?token=${token}`
  return queryArguments.reduce((finalURL, argument) => (
    `${finalURL}&${argument}`
  ), finalURL)
}

export const getQueryArguments = (schema, values = STATIC_TOKEN_SAMPLE_VALUES) => {
  let queryArguments = []
  if (schema.indexOf('EXPIRES') > -1) {
    queryArguments.push(`expires=${values.EXPIRES}`)
  }
  queryArguments.push('mode=fullscreen')
  return queryArguments
}
