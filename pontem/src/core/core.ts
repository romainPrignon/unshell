type Options = {
  output: boolean
  verbose: boolean
  env: object
}

const chalk = require('chalk')

const OUTPUT_ERROR = chalk.red.bold
const OUTPUT_SUCCESS = chalk.green.bold
const VERBOSE = chalk.cyan.bold

const { isArray } = require('util')

const { shellSync, shell } = require('execa')

const isGenerator = (fn: Function) => fn.constructor.name === 'GeneratorFunction'
const isAsync = (fn: Function) => fn.constructor.name === 'AsyncFunction'
const isEmpty = (cmd: string) => !cmd.length
const cleanStr = (str: string) => str.replace(/  +/g, ' ')

const verbose = (cmd: string) => console.log(cleanStr(`${VERBOSE('➜')} ${cmd}`))

const processCmd = async (cmd: Array<string>, options: Options = defaultOptions): Promise<any> => {
  if (isArray(cmd)) {
    return Promise.all(cmd.map(async (c: any) => {
      if (typeof c.next === 'function') {
        let next = c.next()
        let res
        while (next.done === false) {
          if (isEmpty(next.value)) {
            next = c.next('')
            continue
          }

          console.log(`\n`)

          verbose(next.value)

          if (isArray(next.value)) {
            res = await processCmd(next.value, options)
            const out = res.map((r: any) => r.stdout)
            if (options.output) out.map((o: string) => console.log(`• ${o}`))
            next = c.next(out)
          } else {
            res = await processCmd(next.value, options)
            if (res.stdout) console.log(`• ${res.stdout}`)
            next = c.next(res.stdout)
          }
        }
        // last iteration
        if (next.value) {
          res = await shell(next.value)
          console.log(res.stdout)
        }

        return res
      } else {
        const res = await shell(c, options)
        return res
      }
    }))
  }

  const res = await shell(cmd, options).stdout // adding stdout send a stream instead

  return res
}

// @TODO
// handle multiline command verbose
// stream cmd output
// cb ???????
const defaultOptions = {
  verbose: true,
  output: true,
  env: {}
}
export const Pontem = (options: Options = defaultOptions) => async (fn: Function, ...args: Array<any>) => {
  if (!isGenerator(fn)) {
    const cmd = await fn(...args)

    if (isEmpty(cmd)) return 0

    if (options.verbose) verbose(cmd)

    if (isArray(cmd)) {
      const res = await processCmd(cmd, options)
      if (options.output) res.map((r: any) => console.log(`• ${r.stdout}`))
    } else {
      const res: any = processCmd(cmd, options)
      if (options.output && res.stdout) console.log(`• ${res.stdout}`)
      // if (options.output && res) res.pipe(process.stdout)
    }

    return 0
  }

  const it = fn(...args)

  let next = it.next()

  while (next.done === false) {
    if (isEmpty(next.value)) {
      next = it.next('')
      continue
    }

    // console.log(`\n`)

    if (options.verbose) verbose(next.value)

    if (isArray(next.value)) {
      const res = await processCmd(next.value, options)
      const out = res.map((r: any) => r.stdout)
      if (options.output) out.map((o: string) => console.log(`Array(•) ${o}`))
      next = it.next(out)
    } else {
      const res = await processCmd(next.value, options)

      // if (options.output && res.stdout) console.log(`• ${res.stdout}`)
      if (options.output && res) res.pipe(process.stdout) // send stdout to parent (visible in test)
      next = it.next(res.stdout)
    }
  }

  // last iteration
  if (next.value) {
    const lastCmd = await shell(next.value)
    // const lastCmd = await shell(next.value).stdout
    console.log(lastCmd.stdout)
    // if (options.output && lastCmd) lastCmd.pipe(process.stdout)
  }
}
