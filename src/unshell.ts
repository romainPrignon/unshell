import { Options, Command } from '../type'

import util from 'util'
import child_process from 'child_process'


const defaultOptions = {
  env: {}
}

export const unshell = <Args extends Array<unknown>>(opt: Options = defaultOptions) => {

  const exec = util.promisify(child_process.exec)

  return async (
    script: (...args: Args) => IterableIterator<Command>,
    ...args: Args
  ): Promise<void> => {
    if (!isGenerator(script)) {
      const err = new Error(`module must be a generator`)
      console.error(err)

      throw err
    }

    const it = script(...args)
    let cmd = it.next()

    while (cmd.done === false) {
      console.log(`• ${cmd.value}`)

      try {
        const { stdout } = await exec(cmd.value, opt)

        if (stdout) {
          console.log(`➜ ${stdout}`)
        }

        cmd = it.next(stdout)
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

const isGenerator = (fn: Function): fn is GeneratorFunction => fn.constructor.name === 'GeneratorFunction'
