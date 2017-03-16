import FileDialog from './file-dialog'
import Reader from './file-reader'
import * as api from '../api'

/**
 * _accessKey, _onProgress, _gateway - using Symbols as private members of Uploader
 * @type {Symbol}
 * @private
 */
const _accessKey = Symbol('accessKey')
const _onProgress= Symbol('onProgress')
const _gateway = Symbol('gateway')

/**
 * Represents file Uploader instance,
 * exposes public API for open file dialog,
 * read and upload files
 */
class Uploader {
  static get displayName() {
    return 'httpFileUploader'
  }

  /**
   * Initialize and return new Uploader instance
   * @param accessKey {string} - upload access key
   * @param gateway {string} - gateway host
   * @param onProgress {function} - handler wrapper
   * @returns {Uploader}
   */
  static initialize(accessKey, gateway, onProgress) {
    if (!arguments.length || [...arguments].includes(undefined)) {
      throw new Error(`${Uploader.displayName} initialization failed`)
    }

    return new Uploader(accessKey, gateway, onProgress)
  }

  constructor(accessKey, gateway, onProgress) {
    this[_accessKey] = accessKey
    this[_onProgress] = onProgress
    this[_gateway] = gateway

    this.openFileDialog = this.openFileDialog.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
    this.processFiles = this.processFiles.bind(this)
  }

  get accessKey() {
    return this[_accessKey]
  }

  get gateway() {
    return this[_gateway]
  }

  get onProgress() {
    return this[_onProgress]
  }

  /**
   * Upload file via API
   * @param file {File} - HTML File object to upload
   */
  uploadFile(file) {
    api.uploadFile(this.accessKey, this.gateway, file, this.onProgress)
  }

  /**
   * Read and upload files
   * @param files []
   */
  processFiles(files) {
    for (const file of files) Reader.readFile(file).then(this.uploadFile)
  }

  /**
   * open Browser File Dialog
   */
  openFileDialog() {
    FileDialog.open().then(this.processFiles)
  }
}

/**
 * @export @static initialize method to create Uploader instance
 */
export default { initialize: Uploader.initialize }
