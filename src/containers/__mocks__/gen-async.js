export const genAsyncMock = () => {
  return new Promise((resolve) => {
    process.nextTick(
      () => resolve(
        []
      )
    )
  })
}
