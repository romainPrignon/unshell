import { exec } from 'child_process'

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

describe('displayHelp', () => {

  describe('cli', () => {
    it('should display help when needed from cli', async () => {
      // Given
      const env = {}

      // When
      await cli({ argv: ['node', 'unshell', 'help'], env })

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `Execute script through unshell runtime

Usage:
  unshell COMMAND [SCRIPT_PATH] [ARGS...]

Commands:
  help      Print this help message
  run       run a script through unshell runtime`)
    })
  })

  describe('e2e', () => {
    it('should display help when needed from e2e', (done) => {
      // Given
      const cliPath = `${__dirname}/../src/cli.ts`
      const unshellCommand = 'help'

      // When
      const subprocess = exec(`ts-node ${cliPath} ${unshellCommand}`, (_, stdout) => {
        // Then
        expect(stdout).toEqual(`Execute script through unshell runtime

Usage:
  unshell COMMAND [SCRIPT_PATH] [ARGS...]

Commands:
  help      Print this help message
  run       run a script through unshell runtime
`)

        // Clean
        subprocess.kill()

        done()
      })
    })
  })
})
