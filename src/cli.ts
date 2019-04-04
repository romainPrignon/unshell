import { resolve } from 'path'

import { unshell } from './unshell'
import { red } from './utils/colors'


type MainOpt = { argv: Array<string>, env: NodeJS.ProcessEnv }


export const cli = async ({ argv, env }: MainOpt): Promise<void> => {
  const [scriptPath, ...args] = argv.slice(2)

  let script
  try {
    script = require(resolve(scriptPath))
  } catch (err) {
    console.error(`${red('✘')} unshell: script_path not valid`)

    throw err
  }

  try {
    await unshell({ env })(script)(...args)
  } catch (err) {
    // TODO: if code unshell
    const msg = `
      ${red('✘')} unshell: something went wrong
    `
    console.error(msg)

    throw err // or better depending on debug
  }
}

/* istanbul ignore next */
if (require.main === module) {
  const argv = process.argv
  const env = process.env

  cli({ argv, env })
    .then(process.exit(0))
    .catch(process.exit(1))
}
