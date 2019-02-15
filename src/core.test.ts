// type
import { Options, Command } from '../type'

// mock
jest.mock('util')
import util from 'util'

// test
import Unshell from './core'


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

describe('Unshell', () => {
  const cmd = `echo OK`
  const stdout = `result of echo OK`
  const stderr = `'Error: exec'`
  const opt: Options = {
    env: {}
  }

  it('should return if script is a generator', () => {
    // Arrange
    const script = function * (): IterableIterator<string> {
      yield `ok`
    }

    // Act
    const output = Unshell(opt)(script)

    // Assert
    expect(output).toBeInstanceOf(Function)
  })

  it('should handle script with default option', () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield `ok`
    }

    // Act
    const output = Unshell()(script)

    // Assert
    expect(output).toBeInstanceOf(Function)
  })

  it('should throw if script is not a generator', async (done) => {
    // Arrange
    const script: any = function () {
      return cmd
    }

    try {
      await Unshell(opt)(script)()

      done(`Script is not a generator`)
    } catch (err) {
      expect(err.message).toEqual('module must be a generator')

      done()
    }

  })

  it('should log command', async () => {
    // Arrange
    const script = function * (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    const execMock = jest.fn(() => ({
      stdout
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    // Assert
    expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)
  })

  it('should process command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    expect(execMock).toHaveBeenCalledWith(cmd, opt)
  })

  it('should not log undefined yielded command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout: undefined
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
  })

  it('should process several command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
      yield cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    expect(execMock).toHaveBeenNthCalledWith(1, cmd, opt)
    expect(execMock).toHaveBeenNthCalledWith(2, cmd, opt)
  })

  it('should handle command throwing error', async (done) => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    const errMock: any = new Error(stderr)
    errMock.stderr = stderr
    errMock.cmd = cmd

    const execMock = jest.fn((cmd: Command, opt: Options) => {
      throw errMock
    })

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    try {
      await Unshell(opt)(script)()

      done(`It doesn't handle stderr properly`)
    } catch (err) {
      expect(console.error).toHaveBeenCalledWith({
        cmd: errMock.cmd,
        stderr: errMock.stderr
      })

      expect(err).toEqual(errMock)

      done()
    }
  })

  it('should log returned command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      return cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    // Assert
    expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
    expect(execMock).toHaveBeenCalledWith(cmd, opt)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)
  })

  it('should not log undefined returned command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      return cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout: undefined
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    // Assert
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
  })

  it('should log yielded command and returned command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
      return cmd
    }

    // Mock
    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))

    // @ts-ignore
    util.promisify = jest.fn().mockImplementation(() => {
      return execMock
    })

    // Act
    await Unshell(opt)(script)()

    // Assert
    // yield
    expect(console.log).toHaveBeenNthCalledWith(1, `• ${cmd}`)
    expect(execMock).toHaveBeenNthCalledWith(1, cmd, opt)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)

    // return
    expect(console.log).toHaveBeenNthCalledWith(3, `• ${cmd}`)
    expect(execMock).toHaveBeenNthCalledWith(2, cmd, opt)
    expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${stdout}`)
  })
})
