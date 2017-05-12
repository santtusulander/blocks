import FileDialog from './file-dialog'
import Reader from './file-reader'
import * as api from '../api'

/**
 * _accessKey, _uploadHandlers, _gateway - using Symbols as private members of Uploader
 * @type {Symbol}
 * @private
 */
const _accessKey = Symbol('accessKey')
const _uploadHandlers = Symbol('uploadHandlers')
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
   * @param uploadHandlers {object} - handlers wrapper
   * @returns {Uploader}
   */
  static initialize(accessKey, gateway, uploadHandlers) {
    if (!arguments.length || [...arguments].includes(undefined)) {
      throw new Error(`${Uploader.displayName} initialization failed`)
    }

    return new Uploader(accessKey, gateway, uploadHandlers)
  }

  constructor(accessKey, gateway, uploadHandlers) {
    this[_accessKey] = accessKey
    this[_uploadHandlers] = uploadHandlers
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

  get uploadHandlers() {
    return this[_uploadHandlers]
  }

  /**
   * Upload file via API
   * @param file {File} - HTML File object to upload
   */
  uploadFile(file, hasABRWorkFlow) {
    api.uploadFile(this.accessKey, this.gateway, file, this.uploadHandlers, hasABRWorkFlow)
  }

  /**
   * Read and upload files
   * @param files []
   */
  processFiles(files, hasABRWorkFlow) {
    [...files].forEach(file => Reader.readFile(file).then((processedFile) => {
      this.uploadFile(processedFile, hasABRWorkFlow)
    }))
  }

  /**
   * open Browser File Dialog
   */
  openFileDialog(hasABRWorkFlow) {
    FileDialog.open().then(files => {
      this.processFiles(files, hasABRWorkFlow)
    })
  }
}

/**
 * @export @static initialize method to create Uploader instance
 */
export default { initialize: Uploader.initialize }
