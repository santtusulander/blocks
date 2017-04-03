import utils from 'axios/lib/utils'
import parseHeaders from 'axios/lib/helpers/parseHeaders'
import transformData from 'axios/lib/helpers/transformData'
import settle from 'axios/lib/helpers/settle'
import cookies from 'axios/lib/helpers/cookies'
import isURLSameOrigin from 'axios/lib/helpers/isURLSameOrigin'

import * as actionTypes from '../actionTypes'

const fileUploadAdapter = (resolve, reject, config) => {
  const {url, uploadHandlers, fileName, data, headers, method, timeout, responseType} = config

  /* PROPERTIES FOR BINDING EVENT LISTENERS */
  const loadEvent = 'onreadystatechange'
  const errorEvent = 'onerror'
  const progressEvent = 'onprogress'
  const loadstartEvent = 'onloadstart'

  /* 204 STATUS CODE FOR IE BROWSER */
  const ie204 = 1223
  const noContent = 'No Content'


  /* PREPARE REQUEST */
  let xhr = new XMLHttpRequest()
  xhr.open(method.toUpperCase(), url, true)

  // Set the request timeout in MS
  xhr.timeout = timeout

  /* EVENT HANDLERS */
  xhr[loadEvent] = () => {
    if (!xhr || xhr.readyState !== 4 || xhr.status === 0) {return}

    const respHeaders = 'getAllResponseHeaders' in xhr ? parseHeaders(xhr.getAllResponseHeaders()) : null
    const responseData = !config.responseType || config.responseType === 'text' ? xhr.responseText : xhr.response
    const response = {
      data: transformData(responseData, respHeaders, config.transformResponse),
      status: xhr.status === ie204 ? 204 : xhr.status,
      statusText: xhr.status === ie204 ? noContent : xhr.statusText,
      headers: respHeaders,
      config: config,
      request: xhr
    }

    settle(resolve, reject, response)

    xhr = null
  }

  xhr.upload[progressEvent] = (e) => {
    const { lengthComputable, loaded, total } = e
    const progress = lengthComputable ? parseInt(loaded / total * 100) : 0
    uploadHandlers[actionTypes.UPLOAD_PROGRESS](fileName, xhr, progress)
  }

  xhr[errorEvent] = () => {
    reject(fileName)
    xhr = null
  }

  xhr.upload[loadstartEvent] = () => {
    uploadHandlers[actionTypes.UPLOAD_FILE](fileName, xhr)
  }

  /* UPDATE HEADERS */
  const xsrf = config.withCredentials || isURLSameOrigin(url) ?
    cookies.read(config.xsrfCookieName) :
    undefined

  if (xsrf) {
    headers[config.xsrfHeaderName] = xsrf
  }

  if (data instanceof FormData) {
    delete headers['Content-Type']
  }

  if (config.withCredentials) {
    xhr.withCredentials = true
  }

  if ('setRequestHeader' in xhr) {
    utils.forEach(headers, (val, key) => {
      if (typeof data === 'undefined' && key.toLowerCase() === 'content-type') {
        delete headers[key];
      } else {
        xhr.setRequestHeader(key, val);
      }
    });
  }

  if (responseType) {
    try {
      xhr.responseType = responseType
    } catch (e) {
      if (xhr.responseType !== 'json') {throw e}
    }
  }

  /* SEND REQUEST */
  xhr.send(data)
}

export default fileUploadAdapter
