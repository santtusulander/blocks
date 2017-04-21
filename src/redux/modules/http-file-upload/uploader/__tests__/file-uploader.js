jest.unmock('../file-uploader')
// jest.unmock('../file-dialog')
import FileUploader from '../file-uploader'

const INIT_ERROR = 'httpFileUploader initialization failed'

describe('FileUploader', () => {
  it('should be an object with initialize method', () => {
    expect(FileUploader).toHaveProperty('initialize')
    expect(typeof FileUploader.initialize).toEqual('function')
  })

  describe('Initialization', () => {
    const init = (key, gateway, handlers) => FileUploader.initialize(key, gateway, handlers)

    it('should throw an Error when initialized without required params', () => {
      expect(() => init()).toThrowError(INIT_ERROR)
    })
    it('should throw an Error when initialized with any of undefined params', () => {
      let handlers;
      expect(() => init('key', 'gateway', handlers)).toThrowError(INIT_ERROR)
    })
    it('should return an Uploader instance when all params specified', () => {
      expect(() => init('key', 'gateway', {})).toBeInstanceOf(Object)
    })
  })

  describe('Instance', () => {
    const accessKey = 'key'
    const gateway = 'https://gateway'
    const uploadHandlers = {
      handlerMock: jest.fn()
    }
    let Uploader = null;

    beforeEach(() => {
      Uploader = FileUploader.initialize(accessKey, gateway, uploadHandlers)
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

  })
})
