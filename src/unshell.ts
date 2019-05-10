import { Options, Script, Args, Engine } from '../type'

import util from 'util'
import child_process from 'child_process'


const defaultOptions = {
  env: {}
}

export const unshell = (opt: Options = defaultOptions): Engine => {

  const exec = util.promisify(child_process.exec)

  return async (script: Script, ...args: Args): Promise<void> => {
    assertUnshellScript(script)

    const it = script(...args)
    let cmd = await it.next()

    while (cmd.done === false) {
      if (isEmptyCmd(cmd.value)) {
        cmd = await it.next()
        continue
      }

      console.log(`• ${cmd.value}`)

      try {
        const { stdout } = await exec(cmd.value, opt)

        if (stdout) {
          console.log(`➜ ${stdout}`)
        }

        cmd = await it.next(stdout)
      } catch (err) {
        console.error({
          cmd: err.cmd,
          stderr: err.stderr
        })

        throw err
      }
    }

    // last iteration
    if (cmd.done === true && cmd.value) {
      console.log(`• ${cmd.value}`)
      const { stdout } = await exec(cmd.value, opt)
      if (stdout) {
        console.log(`➜ ${stdout}`)
      }
    }
  }
}

export const assertUnshellScript = (fn: Function): fn is Script => {
  if (isGenerator(fn)) return true
  if (isAsyncGenerator(fn)) return true

  throw new Error('unshell: Invalid SCRIPT')
}

const isGenerator = (fn: Function): fn is () => IterableIterator<string> =>
  fn.constructor.name === 'GeneratorFunction'

const isAsyncGenerator = (fn: Function): fn is () => AsyncIterableIterator<string> =>
  fn.constructor.name === 'AsyncGeneratorFunction'

const isEmptyCmd = (cmd: string): boolean => !cmd.length
