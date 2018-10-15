import chalk from 'chalk'
import { isArray } from 'util'

const OUTPUT_ERROR = chalk.red.bold
const OUTPUT_SUCCESS = chalk.green.bold
const VERBOSE = chalk.cyan.bold

const isGenerator = (fn: Function) => fn.constructor.name === 'GeneratorFunction'
const isAsync = (fn: Function) => fn.constructor.name === 'AsyncFunction'
const isEmpty = (cmd: string) => !cmd.length
const cleanStr = (str: string) => str.replace(/{2}+/g, ' ')
const verbose = (cmd: string) => console.log(cleanStr(`${VERBOSE('➜')} ${cmd}`))

export const unshell = (fn: Function) => async (...args: Array<unknown>) => {
  // fn must be a generator

  const it = fn(...args)
  let next = it.next()

  while (next.done === false) {
    const res = process(next.value)

    next = it.next(res)
  }
}

const process = (cmd: string) => console.log(cmd)

// class Unshell(processor) {
//   do(fn)(args)
//   static do() // use buildin processor
//   Unshell.a = function () {...}
// }
