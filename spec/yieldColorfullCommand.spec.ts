import { unshell } from '../src/unshell'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('yieldColorfullCommand', () => {

  describe('unshell', () => {
    it('should execute colorfull command', async () => {
      // Given
      const opt = { env: {} }
      const script = function* (): IterableIterator<string> {
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
