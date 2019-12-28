import { unshell } from '../src/unshell'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('yieldEmptyCommand', () => {

  describe('unshell', () => {
    it('should not execute empty command', async () => {
      // Given
      const opt = { env: {} }
      const script = function* (): IterableIterator<string> {
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
