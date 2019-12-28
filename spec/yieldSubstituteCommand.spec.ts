import { unshell } from '../src/unshell'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('yieldSubstituteCommand', () => {

  describe('unshell', () => {
    it('should replace variable before executing command', async () => {
      // Given
      const opt = { env: {} }

      const echoFoo = () => `echo foo`
      const someValue = 'some_value'

      const script = function* (): IterableIterator<string> {
        yield `echo $(${echoFoo()})`
        yield `
          some_variable="${someValue}"
          echo $some_variable
        `
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ foo\n`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${someValue}\n`)
    })
  })
})
