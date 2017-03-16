const getStorageUploads = ({ storageUploads }) => storageUploads

export default (state) => ({
  uploads: getStorageUploads(state)
})
