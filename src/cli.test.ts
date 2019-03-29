jest.mock('./unshell.ts')
import * as unshell from './unshell'


import { red } from './utils/colors'
import { cli } from './cli'


describe('cli', () => {
  it('should display error if called with no script', async () => {
    // Arrange
    const argv: Array<string> = []
    const env: NodeJS.ProcessEnv = {}

    // Mock
    console.error = jest.fn()

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow('Path must be a string. Received undefined')
    expect(console.error).toHaveBeenCalled()
  })

  it('should display error if called with error in script', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/hello.js`
    const argv: Array<string> = ['node', 'unshell', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('some-error')

    console.error = jest.fn()

    // @ts-ignore
    unshell.unshell = jest.fn(() => () => () => { throw error })

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow(error)

    // @ts-ignore
    const msg = console.error.mock.calls[0][0].trim()
    expect(msg).toEqual(`${red('✘')} unshell: something went wrong`)
  })

  it('should process script', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/hello.js`
    const argv: Array<string> = ['node', 'unshell', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    console.error = jest.fn()

    // @ts-ignore
    unshell.unshell = jest.fn(() => () => () => { return })

    // Assert
    await expect(cli({ argv, env })).resolves.toEqual(undefined)
    expect(console.error).not.toHaveBeenCalled()

    // Clean
    jest.restoreAllMocks()
  })
})
