export default {
  files: [
    '**/src/**/*.ava.ts',
    '**/spec/**/*.ava.ts',
  ],
  extensions: ['ts'],
  require: [
    "ts-node/register"
  ],
  failFast: false,
  verbose: true,
}
