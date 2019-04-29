import { exec } from 'child_process'

import { unshell } from '../src/unshell'
import { cli } from '../src/cli'


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

describe('yieldAndReturnCommand', () => {

  describe('unshell', () => {
    it('should exec to a yield and return of a command', async () => {
      // Given
      const opt = { env: {} }
      const script = function* () {
        yield `echo hello`
        return `echo world`
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `• echo hello`)
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ hello\n`)
      expect(console.log).toHaveBeenNthCalledWith(3, `• echo world`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ world\n`)
    })
  })

  describe('cli', () => {
    it('should exec to a yield and return of a command from cli', async () => {
      // Given
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldAndReturnCommand.js`
      const env = {}

      // When
      await cli({ argv: ['node', 'unshell', scriptPath], env })

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `• echo hello`)
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ hello\n`)
      expect(console.log).toHaveBeenNthCalledWith(3, `• echo world`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ world\n`)
    })
  })

  describe('e2e', () => {
    it('should exec to a yield and return of a command from e2e', (done) => {
      // Given
      const cliPath = `${__dirname}/../src/cli.ts`
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldAndReturnCommand.js`

      // When
      const subprocess = exec(`ts-node ${cliPath} ${scriptPath}`, (_, stdout) => {
        // Then
        expect(stdout).toEqual('• echo hello\n➜ hello\n\n• echo world\n➜ world\n\n')

        // Clean
        subprocess.kill()

        done()
      })
    })
  })
})
