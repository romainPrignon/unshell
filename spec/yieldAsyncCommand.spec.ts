import { unshell } from '../src/unshell'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation()
  jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe('yieldAsyncCommand', () => {

  describe('unshell', () => {
    it('should execute async command in order', async () => {
      // Given
      const opt = { env: {} }
      const args: Array<any> = []

      const hello = async (): Promise<string> => {
        return new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve('echo hello')
          }, 2)
        })
      }
      const world = async (): Promise<string> => {
        return new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve('echo world')
          }, 1)
        })
      }

      const script = async function* (): AsyncIterableIterator<string> {
        yield hello()
        yield world()
      }

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(2, `➜ hello\n`)
      expect(console.log).toHaveBeenNthCalledWith(4, `➜ world\n`)
    })

    it('should execute command after an async stuff', async () => {
      // Given
      const opt = { env: {} }
      const args: Array<any> = []

      const hello = async (): Promise<string> => {
        return new Promise<string>((resolve) => {
          setImmediate(() => {
            resolve('hello')
          })
        })
      }

      const script = async function* (): AsyncIterableIterator<string> {
        console.log(await hello())
        yield `echo world`
      }

      // When
      await unshell(opt)(script, ...args)

      // Then
      expect(console.log).toHaveBeenNthCalledWith(1, `hello`)
      expect(console.log).toHaveBeenNthCalledWith(3, `➜ world\n`)
    })
  })
})
