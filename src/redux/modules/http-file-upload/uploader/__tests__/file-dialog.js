jest.unmock('../file-dialog.js')
import FileDialog from '../file-dialog'


describe('FileDialog', () => {
  describe('static getters', () => {
    it('inputElement should be HTML input element', () => {
      expect(FileDialog.constructor.inputElement).toBeInstanceOf(HTMLInputElement)
    })
    it('inputElement should have type, multiple attributes', () => {
      expect(FileDialog.constructor.inputElement.getAttribute('type')).toEqual('file')
      expect(FileDialog.constructor.inputElement.getAttribute('multiple')).toEqual('')
    })
    it('inputElement should be hidden', () => {
      expect(FileDialog.constructor.inputElement.style.display).toEqual('none')
    })

    it('isIE should return boolean type', () => {
      expect(typeof FileDialog.constructor.isIE === 'boolean').toBeTruthy()
    })

    it('clickEvent should be DOM Click Event', () => {
      expect(FileDialog.constructor.clickEvent).toBeInstanceOf(Event)
    })
  })

  describe('public methods', () => {
    it('should have method open', () => {
      expect(typeof FileDialog.open === 'function').toBeTruthy()
    })
    it('open should return a Promise', () => {
      expect(FileDialog.open()).toBeInstanceOf(Promise)
    })
  })
})
