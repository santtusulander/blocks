import md5 from 'blueimp-md5'
import { jsSHA1, jsSHA256 } from 'jssha'
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
      return md5(string, key)
    case 'HMAC_SHA1':
      const sha1Obj = new jsSHA1('SHA-1', "TEXT")
      sha1Obj.setHMACKey(key, "TEXT")
      sha1Obj.update(string)
      return sha1Obj.getHMAC("HEX")
    case 'HMAC_SHA256':
      const sha256Obj = new jsSHA256('SHA-256', "TEXT")
      sha256Obj.setHMACKey(key, "TEXT")
      sha256Obj.update(string)
      return sha256Obj.getHMAC("HEX")
    case 'MD5':
      return md5(string)
  }
}

export const generateFinalURL = (token, queryArguments) => {
  let url = STATIC_TOKEN_SAMPLE_VALUES.URL
  if (url.indexOf('http') !== 0) {
    url = `http://${url}`
  }
  url = `${url}?token=${token}`
  return queryArguments.reduce((finalURL, argument) => (
    `${finalURL}&${argument}`
  ), url)
}

export const getQueryArguments = (schema, values = STATIC_TOKEN_SAMPLE_VALUES) => {
  const queryArguments = []
  if (schema.indexOf('EXPIRES') > -1) {
    queryArguments.push(`expires=${values.EXPIRES}`)
  }
  queryArguments.push('mode=fullscreen')
  return queryArguments
}
