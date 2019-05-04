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

describe('yieldEnvVarCommand', () => {

  describe('unshell', () => {
    it('should execute command with env vars', async () => {
      // Given
      const SOME_ENV_VALUE = 'SOME_ENV_VALUE'
      const opt = { env: {
        SOME_ENV_VAR: SOME_ENV_VALUE
      } }
      process.env.SOME_ENV_VAR = opt.env.SOME_ENV_VAR
      const script = function* () {
        console.log(`node: ${process.env.SOME_ENV_VAR}`)
        yield `echo $SOME_ENV_VAR`
      }
      const args: Array<any> = []

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `node: ${SOME_ENV_VALUE}`)
      expect(console.log).toHaveBeenNthCalledWith(2, `• echo $SOME_ENV_VAR`)
      expect(console.log).toHaveBeenNthCalledWith(3, `➜ ${SOME_ENV_VALUE}\n`)

      // Clean
      delete process.env.SOME_ENV_VAR
    })
  })

  describe('cli', () => {
    it('should execute command with env vars from cli', async () => {
      // Given
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldEnvVarCommand.js`
      const SOME_ENV_VALUE = 'SOME_ENV_VALUE'
      const env = {
        SOME_ENV_VAR: SOME_ENV_VALUE
      }
      process.env.SOME_ENV_VAR = env.SOME_ENV_VAR

      // When
      await cli({ argv: ['node', 'unshell', scriptPath], env })

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `node: ${SOME_ENV_VALUE}`)
      expect(console.log).toHaveBeenNthCalledWith(2, `• echo $SOME_ENV_VAR`)
      expect(console.log).toHaveBeenNthCalledWith(3, `➜ ${SOME_ENV_VALUE}\n`)

      // Clean
      delete process.env.SOME_ENV_VAR
    })
  })

  describe('e2e', () => {
    it('should execute command with env vars from cli from e2e', (done) => {
      // Given
      const cliPath = `${__dirname}/../src/cli.ts`
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldEnvVarCommand.js`

      const SOME_ENV_VALUE = 'SOME_ENV_VALUE'

      // When
      const subprocess = exec(`SOME_ENV_VAR=${SOME_ENV_VALUE} ts-node ${cliPath} ${scriptPath}`, (_, stdout) => {
        // Then
        expect(stdout).toEqual(`node: ${SOME_ENV_VALUE}\n• echo $SOME_ENV_VAR\n➜ ${SOME_ENV_VALUE}\n\n`)

        // Clean
        subprocess.kill()

        done()
      })
    })
  })
})
