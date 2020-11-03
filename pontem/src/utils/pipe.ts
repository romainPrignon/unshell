export const pipe = (f1: Function, ...fns: Array<Function>) =>
  (...args: Array<any>) =>
    fns.reduce(
      (res, fn) => `${res} | ${fn()}`,
      f1.apply(null, args) || ``
    )
