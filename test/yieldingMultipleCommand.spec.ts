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

describe('unshell', () => {
  it('should execute multiple command as expected', async () => {
    // Given
    const opt = { env: {} }
    const script = function * () {
      yield `echo hello`
      yield `echo world`
    }
    const args: Array<any> = []

    // When
    await unshell(opt)(script)(args)

    // Then
    expect(console.log).toHaveBeenNthCalledWith(1, `• echo hello`)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ hello\n`)
    expect(console.log).toHaveBeenNthCalledWith(3, `• echo world`)
    expect(console.log).toHaveBeenNthCalledWith(4, `➜ world\n`)
  })
})

describe('cli', () => {
  it('should execute multiple command as expected from cli', async () => {
    // Given
    const scriptPath = `${__dirname}/../fixtures/scripts/yieldMultipleCommand.js`
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
