jest.mock('./unshell.ts')
import * as unshell from './unshell'

jest.mock('path')
import path from 'path'

import { red } from './utils/colors'
import { cli } from './cli'


describe('cli', () => {
  it('should display error if called with no script', async () => {
    // Arrange
    const argv: Array<string> = []
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('path-error')
    path.resolve = jest.fn(() => { throw error })
    console.error = jest.fn()

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow(error)
    expect(console.error).toHaveBeenCalled()
  })

  it('should display error if called with error in script', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
    const argv: Array<string> = ['node', 'unshell', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    const error = new Error('some-error')

    console.error = jest.fn()

    // @ts-ignore
    unshell.unshell = jest.fn(() => async () => { throw error })

    path.resolve = jest.fn(() => { return scriptPath })

    // Assert
    await expect(cli({ argv, env })).rejects.toThrow(error)

    // @ts-ignore
    const msg = console.error.mock.calls[0][0].trim()
    expect(msg).toEqual(`${red('✘')} unshell: something went wrong`)
  })

  it('should process script', async () => {
    // Arrange
    const scriptPath = `${__dirname}/../fixtures/scripts/onlyReturnCmd.js`
    const argv: Array<string> = ['node', 'unshell', scriptPath]
    const env: NodeJS.ProcessEnv = {}

    // Mock
    console.error = jest.fn()

    // @ts-ignore
    unshell.unshell = jest.fn(() => async () => { return })

    path.resolve = jest.fn(() => { return scriptPath })

    // Assert
    await expect(cli({ argv, env })).resolves.toEqual(undefined)
    expect(console.error).not.toHaveBeenCalled()
  })
})
