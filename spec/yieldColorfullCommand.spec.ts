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

describe('yieldColorfullCommand', () => {

  describe('unshell', () => {
    it('should execute colorfull command', async () => {
      // Given
      const opt = { env: {} }
      const script = function* () {
        const RED_COLOR = '$(tput setaf 1)'
        const GREEN_COLOR = '$(tput setaf 2)'
        const NO_COLOR = '$(tput sgr0)'

        yield `echo ${RED_COLOR}red${NO_COLOR}`
        yield `echo ${GREEN_COLOR}green${NO_COLOR}`
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ red\n`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ green\n`)
    })
  })
})
