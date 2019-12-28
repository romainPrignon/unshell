import { Options, Script, Args, Engine } from '../type'

import util from 'util'
import child_process from 'child_process'


const defaultOptions = {
  env: {}
}

export const unshell = (opt: Options = defaultOptions): Engine => {
  return async (script: Script, ...args: Args): Promise<void> => {
    assertUnshellScript(script)

    const it = script(...args)

    const interpretor = Interpretor(opt)
    await interpretor.interpret(it)
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

const isEmptyCmd = (cmd: string): boolean => !cmd

const Interpretor = (opt: Options) => {

  const exec = util.promisify(child_process.exec)

  return {
    async interpret (it: any): Promise<any> {
      const cmd = await it.next()

      if (!cmd.value && cmd.done) {
        return
      }

      // if empty
      if (isEmptyCmd(cmd.value)) {
        return this.interpret(it)
      }

      console.log(`• ${cmd.value}`)

      try {
        const { stdout } = await exec(cmd.value, opt)

        if (stdout) {
          console.log(`➜ ${stdout}`)
        }

        return await this.interpret(it)
      } catch (err) {
        console.error({
          cmd: err.cmd,
          stderr: err.stderr
        })

        throw err
      }
    }
  }
}
