export const getAccessKey = ({ storageAccessToken }) => storageAccessToken

/** TODO: selectors for read and upload progress, */
export default (state) => ({
  accessKey: getAccessKey(state)
})
