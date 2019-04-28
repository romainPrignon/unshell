// type
import { Options, Command } from '../type'

// mock
jest.mock('util')
import util from 'util'

// test
import { unshell } from './unshell'


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
  const cmd = `echo OK`
  const stdout = `result of echo OK`
  const stderr = `'Error: exec'`
  const opt: Options = {
    env: {}
  }

  it('should return async function when called with options', async () => {
    // Act
    const output = unshell(opt)

    // Assert
    expect(output).toBeInstanceOf(Function)
  })

  it('should return async function when called with default options', async () => {
    // Act
    const output = unshell()

    // Assert
    expect(output).toBeInstanceOf(Function)
  })

  it('should throw if script is not a generator', async (done) => {
    // Arrange
    const script: any = function () {
      return cmd
    }

    try {
      await unshell(opt)(script)

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
    await unshell(opt)(script)

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
    await unshell(opt)(script)

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
    await unshell(opt)(script)

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
    await unshell(opt)(script)

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
      await unshell(opt)(script)

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
    await unshell(opt)(script)

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
    await unshell(opt)(script)

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
    await unshell(opt)(script)

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

  it('should pass arguments to script', async () => {
    // Arrange
    const script = function* (...args: Array<number>) {
      for (const arg of args) {
        yield `echo ${arg}`
      }
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
    await unshell<Array<number>>(opt)(script, 1, 2)

    // Assert
    expect(console.log).toHaveBeenNthCalledWith(1, `• echo 1`)
    expect(execMock).toHaveBeenNthCalledWith(1, 'echo 1', opt)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)

    expect(console.log).toHaveBeenNthCalledWith(3, `• echo 2`)
    expect(execMock).toHaveBeenNthCalledWith(2, 'echo 2', opt)
    expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${stdout}`)
  })
})
