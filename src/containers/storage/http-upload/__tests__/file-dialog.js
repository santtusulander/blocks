jest.unmock('./file-dialog.js')

import FileDialog from './file-dialog'

describe('FileDialog Class', () => {
  let subject = null
  let subjectConstructor = null

  beforeEach(() => {
    subject = () => FileDialog
    subjectConstructor = () => FileDialog.constructor
  })

  it('should be instance of FileDialog', () => {
    expect(subject()).toBeInstanceOf(subjectConstructor())
  })



})
