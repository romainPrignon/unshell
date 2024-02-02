import { exec } from 'child_process'

import { unshell } from '../src/unshell'
import { cli } from '../src/cli'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('yieldingArrayCommand', () => {

  describe('unshell', () => {
    it('should execute array command as expected', async () => {
      // Given
      const opt = { env: {} }
      const script = function* (): IterableIterator<Array<string>> {
        yield [`echo hello`, `echo world`]
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      const logCalls = (console.log as jest.Mock).mock.calls.flat()

      expect(logCalls).toContain(`• echo hello`)
      expect(logCalls).toContain(`➜ hello`)
      expect(logCalls).toContain(`• echo world`)
      expect(logCalls).toContain(`➜ world`)
    })

    it.only('should execute array of long command as expected', async () => {
      // Given
      const opt = { env: {} }
      const script = function* (): IterableIterator<Array<string>> {
        yield [`echo two`, `sleep 1; echo one`]
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `• echo two`)
      expect(console.log).toHaveBeenNthCalledWith(2, `• sleep 1; echo one`)
      expect(console.log).toHaveBeenNthCalledWith(3, `➜ two`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ one`)
    })
  })

  describe('cli', () => {
    it('should execute array command as expected from cli', async () => {
      // Given
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldArrayCommand.js`
      const env = {}

      // When
      await cli({ argv: ['node', 'unshell', 'run', scriptPath], env })

      // Then
      const logCalls = (console.log as jest.Mock).mock.calls.flat()

      expect(logCalls).toContain(`• echo hello`)
      expect(logCalls).toContain(`➜ hello`)
      expect(logCalls).toContain(`• echo world`)
      expect(logCalls).toContain(`➜ world`)
    })
  })

  describe('e2e', () => {
    it('should execute array command as expected from e2e', (done) => {
      // Given
      const cliPath = `${__dirname}/../src/cli.ts`
      const unshellCommand = 'run'
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldArrayCommand.js`

      // When
      const subprocess = exec(`ts-node ${cliPath} ${unshellCommand} ${scriptPath}`, (_, stdout) => {
        // Then
        expect(stdout).toEqual('• echo hello\n• echo world\n➜ hello\n➜ world\n')

        // Clean
        subprocess.kill()

        done()
      })
    })
  })
})
