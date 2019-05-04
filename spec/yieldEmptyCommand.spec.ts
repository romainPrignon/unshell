import { unshell } from '../src/unshell'


beforeEach(() => {
  console.log = jest.fn()
  console.error = jest.fn()
})

afterEach(() => {
  // @ts-ignore
  console.log.mockRestore()
  // @ts-ignore
  console.error.mockRestore()
})

describe('yieldEmptyCommand', () => {

  describe('unshell', () => {
    it('should not execute empty command', async () => {
      // Given
      const opt = { env: {} }
      const script = function* () {
        yield ``
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).not.toHaveBeenCalled()
    })
  })
})
