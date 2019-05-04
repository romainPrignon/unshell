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

describe('yieldSubstituteCommand', () => {

  describe('unshell', () => {
    it('should replace variable before executing command', async () => {
      // Given
      const opt = { env: {} }

      const echoFoo = () => `echo foo`
      const some_value = "some_value"

      const script = function* () {
        yield `echo $(${echoFoo()})`
        yield `
          some_variable="${some_value}"
          echo $some_variable
        `
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ foo\n`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${some_value}\n`)
    })
  })
})
