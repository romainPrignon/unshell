type Options = {
  env: NodeJS.ProcessEnv
}

import util from 'util'
import child_process from 'child_process'


const exec = util.promisify(child_process.exec)

const defaultOptions = {
  env: {}
}

// read env to see what's in it
const Unshell = (opt: Options = defaultOptions) => {
  return (script: Function) => {
    return async (...args: Array<unknown>) => {

      if (!isGenerator(script)) {
        console.error(`module must be a generator`)
        process.exit(1)
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
          console.error(err.stderr)
          process.exit(1)
        }
      }

      // last iter
      if (cmd.done === true && cmd.value) {
        console.log(`• ${cmd.value}`)
        const { stdout } = await exec(cmd.value, opt)
        if (stdout) {
          console.log(`➜ ${stdout}`)
        }
      }

      process.exit(0)
    }
  }
}

const isGenerator = (fn: Function): fn is GeneratorFunction => fn.constructor.name === 'GeneratorFunction'

module.exports = Unshell
