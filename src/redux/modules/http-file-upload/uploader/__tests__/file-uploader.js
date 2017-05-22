jest.unmock('../file-uploader')

import FileUploader from '../file-uploader'
import FileDialog from '../file-dialog'
import Reader from '../file-reader'
import * as api from '../../api'

const INIT_ERROR = 'httpFileUploader initialization failed'

describe('FileUploader', () => {
  it('should be an object with initialize method', () => {
    expect(FileUploader).toHaveProperty('initialize')
    expect(typeof FileUploader.initialize).toEqual('function')
  })

  describe('Initialization', () => {
    const init = (key, gateway, handlers, uploadPath) => FileUploader.initialize(key, gateway, handlers, uploadPath)

    it('should throw an Error when initialized without required params', () => {
      expect(() => init()).toThrowError(INIT_ERROR)
    })
    it('should throw an Error when initialized with any of undefined params', () => {
      let handlers;
      expect(() => init('key', 'gateway', handlers)).toThrowError(INIT_ERROR)
    })
    it('should return an Uploader instance when all params specified', () => {
      expect(() => init('key', 'gateway', {}, 'uploadPath')).toBeInstanceOf(Object)
    })
  })

  describe('Instance', () => {
    const accessKey = 'key'
    const gateway = 'https://gateway'
    const uploadHandlers = {}

    let Uploader = null;

    beforeEach(() => {
      Uploader = FileUploader.initialize(accessKey, gateway, uploadHandlers, 'uploadPath')
    })

    describe('protected: ', () => {
      it('accessKey should be read-only', () => {
        expect(Uploader.accessKey).toEqual(accessKey)
        expect(() => {Uploader.accessKey = ''}).toThrowError()
      })
      it('gateway should be read-only', () => {
        expect(Uploader.gateway).toEqual(gateway)
        expect(() => {Uploader.gateway = ''}).toThrowError()
      })
      it('uploadHandlers should be read-only', () => {
        expect(Uploader.uploadHandlers).toEqual(uploadHandlers)
        expect(() => {Uploader.uploadHandlers = ''}).toThrowError()
      })
    })

    describe('public: ', () => {
      let filesMock = ['file1', 'file2']

      beforeEach(() => {
        Reader.readFile = jest.fn().mockImplementation((file) => new Promise(resolve => resolve(file)))
        FileDialog.open = jest.fn().mockImplementation(() => new Promise(resolve => resolve([])))
        api.uploadFile = jest.fn().mockImplementation((accessKey, gateway, file, uploadHandlers) => {})
      })

      it('openFileDialog should open file dialog', () => {
        Uploader.openFileDialog()
        expect(FileDialog.open).toBeCalled()
      })

      it('processFiles should not process if no files', () => {
        Uploader.processFiles([])
        expect(Reader.readFile).not.toHaveBeenCalled()
      })
      it('processFiles should process array of files', () => {
        Uploader.processFiles(filesMock)
        expect(Reader.readFile).toHaveBeenCalledTimes(filesMock.length)
      })

      it('should upload processed files', () => {
        filesMock.forEach(Uploader.uploadFile)
        expect(api.uploadFile).toHaveBeenCalledTimes(filesMock.length)
      })

      it('uploading should be called with initialization params: "accessKey", "gateway", "uploadHandlers", "uploadPath"', () => {
        const [ file ] = filesMock
        const { accessKey, gateway, uploadHandlers, uploadPath } = Uploader
        const expectedParams = [accessKey, gateway, file, uploadHandlers, uploadPath]

        Uploader.uploadFile(file)
        expect(api.uploadFile).toBeCalledWith(...expectedParams)
      })
    })
  })
})
