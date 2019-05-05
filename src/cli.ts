#!/usr/bin/env node

import { resolve } from 'path'

import { unshell } from './unshell'
import { red } from './utils/colors'


type MainOpt = { argv: Array<string>, env: NodeJS.ProcessEnv }

const help = async (): Promise<void> => {
  console.log(`Execute script through unshell runtime

Usage:
  unshell COMMAND [SCRIPT_PATH] [ARGS...]

Commands:
  help      Print this help message
  run       run a script through unshell runtime`)
}

const run = async ({ argv, env }: MainOpt): Promise<void> => {
  const [_, scriptPath, ...args] = argv.slice(2)

  let script
  try {
    script = require(resolve(scriptPath))
  } catch (err) {
    console.error(`${red('✘')} unshell: Invalid SCRIPT_PATH`)

    throw err
  }

  try {
    await unshell({ env })(script, ...args)
  } catch (err) {
    // TODO: if code unshell
    const msg = `
      ${red('✘')} unshell: something went wrong
    `
    console.error(msg)

    throw err // or better depending on debug
  }
}

export const cli = async ({ argv, env }: MainOpt): Promise<void> => {
  const [unshellCommand, ...args] = argv.slice(2)

  switch (unshellCommand) {
    case 'help': return help()
    case 'run': return run({ argv, env })
    default: return help()
  }
}

/* istanbul ignore next */
if (require.main === module) {
  const argv = process.argv
  const env = process.env

  cli({ argv, env })
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
