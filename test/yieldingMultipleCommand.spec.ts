import { unshell } from '../src/unshell'
import { cli } from '../src/cli'

describe('unshell', () => {
  it('should execute multiple command as expected', async () => {
    // Given
    const opt = { env: {} }
    const script = function * () {
      yield `echo hello`
      yield `echo world`
    }
    const args: Array<any> = []

    await unshell(opt)(script)(args)

    // TODO: expect
  })
})

describe('cli', () => {
  it('should execute multiple command as expected from cli', async () => {
    // Given
    const scriptPath = `${__dirname}/../fixtures/scripts/yieldMultipleCommand.js`
    const env = {}

    try {
      await cli({ argv: ['node', 'unshell', scriptPath], env })
    } catch (err) {
      console.error(err)
    }

    // TODO: expect
  })
})
