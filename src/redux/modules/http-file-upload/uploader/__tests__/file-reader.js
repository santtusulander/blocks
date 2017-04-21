jest.unmock('../file-reader')
import Reader from '../file-reader'

const fileMock = {
  name: 'test.txt', content: '...'
}

describe('FileReader', () => {
  it('should have method readFile', () => {
    expect(typeof Reader.readFile).toEqual('function')
  })

  it('readFile should return promise', () => {
    expect(Reader.readFile()).toBeInstanceOf(Promise)
  })

  it(`readFile Promise should be resolved with an object, where key is fileName, value - File`,
    () => Reader.readFile(fileMock).then(res => {
      expect(Object.keys(res)[0]).toEqual(fileMock.name)
      expect(res[fileMock.name]).toEqual(fileMock)
    })
  )
})
