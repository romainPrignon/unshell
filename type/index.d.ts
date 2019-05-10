export type Options = {
  env: NodeJS.ProcessEnv
}

export type Command = string

export type Args = Array<any>

export type Script = (...args: Args) => IterableIterator<Command> | AsyncIterableIterator<Command>

export type Engine = (script: Script, ...args: Args) => Promise<void>
