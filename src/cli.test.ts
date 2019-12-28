// mock
import * as unshell from './unshell'
import path from 'path'

// test
import { red } from './utils/colors'
import { cli } from './cli'


afterEach(() => {
  jest.restoreAllMocks()
})

describe('cli', () => {
  it('should display error if called with no script', async () => {
    // Arrange
    const argv: Array<string> = ['node', 'unshell', 'run']
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('path-error')
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(path, 'resolve').mockImplementation(() => { throw error })

    // Assert
    await expect(cli({ argv, env })).rejects.toEqual(error)
    expect(console.error).toHaveBeenCalledWith(`${red('✘')} unshell: Invalid SCRIPT_PATH`)
  })

  it('should display error if called with a script that is not unshell compatible', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/notCompatibleCmd.js`
    const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('some-error')
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(unshell, 'assertUnshellScript').mockImplementation(() => { throw error })
    jest.spyOn(path, 'resolve').mockImplementation(() => { return scriptPath })

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow()

    const msg = consoleErrorMock.mock.calls[0][0].trim()
    expect(msg).toEqual(`${red('✘')} ${error.message}`)
  })

  it('should display error if called with error in script', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
    const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('some-error')

    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(unshell, 'unshell').mockImplementation(() => { throw error })
    jest.spyOn(unshell, 'assertUnshellScript').mockImplementation(() => { return true })
    jest.spyOn(path, 'resolve').mockImplementation(() => { return scriptPath })

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow(error)

    const msg = consoleErrorMock.mock.calls[0][0].trim()
    expect(msg).toEqual(`${red('✘')} unshell: something went wrong`)
  })

  it('should execute script on "run" command', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
    const argv: Array<string> = ['node', 'unshell', 'run', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(unshell, 'unshell').mockImplementation(() => async () => { return })
    jest.spyOn(unshell, 'assertUnshellScript').mockImplementation(() => { return true })
    jest.spyOn(path, 'resolve').mockImplementation(() => { return scriptPath })

    // Assert
    await expect(cli({ argv, env })).resolves.toEqual(undefined)
    expect(console.error).not.toHaveBeenCalled()
  })

  it('should display help if called with nothing', async () => {
    // Arrange
    const argv: Array<string> = ['node', 'unshell']
    const env: NodeJS.ProcessEnv = {}

    // Mock
    jest.spyOn(console, 'log').mockImplementation()

    // Assert
    await expect(cli({ argv, env })).resolves.toEqual(undefined)
    expect(console.log).toHaveBeenCalled()
  })

  it('should display help on "help" command', async () => {
    // Arrange
    const argv: Array<string> = ['node', 'unshell', 'help']
    const env: NodeJS.ProcessEnv = {}

    // Mock
    jest.spyOn(console, 'log').mockImplementation()

    // Assert
    await expect(cli({ argv, env })).resolves.toEqual(undefined)
    expect(console.log).toHaveBeenCalled()
  })
})
