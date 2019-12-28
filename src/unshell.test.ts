// type
import { Options, Command } from '../type'

// mock
import util from 'util'

// test
import { unshell } from './unshell'


afterEach(() => {
  jest.restoreAllMocks()
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

  it('should throw if script is not a generator', async () => {
    // Arrange
    const script: any = () => {
      return cmd
    }

    await expect(unshell(opt)(script)).rejects.toHaveProperty('message', 'unshell: Invalid SCRIPT')
  })

  it('should log command', async () => {
    // Arrange
    const script = function * (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(util, 'promisify').mockImplementation(() => () => {
      return {
        stdout
      }
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
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))
    jest.spyOn(util, 'promisify').mockImplementation(() => {
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
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(util, 'promisify').mockImplementation(() => () => {
      return {
        stdout: undefined
      }
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
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return execMock
    })

    // Act
    await unshell(opt)(script)

    expect(execMock).toHaveBeenNthCalledWith(1, cmd, opt)
    expect(execMock).toHaveBeenNthCalledWith(2, cmd, opt)
  })

  it('should handle command throwing error', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      yield cmd
    }

    // Mock
    const err: any = new Error(stderr)
    const errMock = {
      ...err,
      stderr: stderr,
      cmd: cmd
    }
    const execMock = jest.fn((cmd: Command, opt: Options) => {
      throw errMock
    })

    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return execMock
    })

    // Act
    await expect(unshell(opt)(script)).rejects.toEqual(errMock)

    // Assert
    expect(console.error).toHaveBeenCalledWith({
      cmd: errMock.cmd,
      stderr: errMock.stderr
    })
  })

  it('should log returned command', async () => {
    // Arrange
    const script = function* (): IterableIterator<string> {
      return cmd
    }

    // Mock
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))
    jest.spyOn(util, 'promisify').mockImplementation(() => {
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
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(util, 'promisify').mockImplementation(() => () => {
      return {
        stdout: undefined
      }
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
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))
    jest.spyOn(util, 'promisify').mockImplementation(() => {
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
    const script = function* (...args: Array<number>): IterableIterator<string> {
      for (const arg of args) {
        yield `echo ${arg}`
      }
    }

    // Mock
    jest.spyOn(console, 'log').mockImplementation()
    jest.spyOn(console, 'error').mockImplementation()

    const execMock = jest.fn((cmd: Command, opt: Options) => ({
      stdout
    }))
    jest.spyOn(util, 'promisify').mockImplementation(() => {
      return execMock
    })

    // Act
    await unshell(opt)(script, 1, 2)

    // Assert
    expect(console.log).toHaveBeenNthCalledWith(1, `• echo 1`)
    expect(execMock).toHaveBeenNthCalledWith(1, 'echo 1', opt)
    expect(console.log).toHaveBeenNthCalledWith(2, `➜ ${stdout}`)

    expect(console.log).toHaveBeenNthCalledWith(3, `• echo 2`)
    expect(execMock).toHaveBeenNthCalledWith(2, 'echo 2', opt)
    expect(console.log).toHaveBeenNthCalledWith(4, `➜ ${stdout}`)
  })
})
