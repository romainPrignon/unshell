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

describe('yieldEnvVarCommand', () => {

  describe('unshell', () => {
    it('should execute command with env vars', async () => {
      // Given
      const SOME_ENV_VALUE = 'SOME_ENV_VALUE'
      const opt = { env: {
        SOME_ENV_VAR: SOME_ENV_VALUE
      } }
      // tslint:disable-next-line: no-object-mutation
      process.env.SOME_ENV_VAR = opt.env.SOME_ENV_VAR
      const script = function* (): IterableIterator<string> {
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
      // tslint:disable-next-line
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
      // tslint:disable-next-line: no-object-mutation
      process.env.SOME_ENV_VAR = env.SOME_ENV_VAR

      // When
      await cli({ argv: ['node', 'unshell', 'run', scriptPath], env })

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `node: ${SOME_ENV_VALUE}`)
      expect(console.log).toHaveBeenNthCalledWith(2, `• echo $SOME_ENV_VAR`)
      expect(console.log).toHaveBeenNthCalledWith(3, `➜ ${SOME_ENV_VALUE}\n`)

      // Clean
      // tslint:disable-next-line
      delete process.env.SOME_ENV_VAR
    })
  })

  describe('e2e', () => {
    it('should execute command with env vars from cli from e2e', (done) => {
      // Given
      const cliPath = `${__dirname}/../src/cli.ts`
      const unshellCommand = 'run'
      const scriptPath = `${__dirname}/../fixtures/scripts/yieldEnvVarCommand.js`

      const SOME_ENV_VALUE = 'SOME_ENV_VALUE'

      // When
      const subprocess = exec(`SOME_ENV_VAR=${SOME_ENV_VALUE} ts-node ${cliPath} ${unshellCommand} ${scriptPath}`, (_, stdout) => {
        // Then
        expect(stdout).toEqual(`node: ${SOME_ENV_VALUE}\n• echo $SOME_ENV_VAR\n➜ ${SOME_ENV_VALUE}\n\n`)

        // Clean
        subprocess.kill()

        done()
      })
    })
  })
})
