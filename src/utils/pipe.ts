export const pipe = (f1: Function, ...fns: Array<Function>) => (...args: Array<unknown>) =>
  fns.reduce(
    (res, fn) => `${res} | ${fn()}`,
    f1.apply(null, args) || ``
  )
