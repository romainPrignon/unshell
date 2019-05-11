# ![un](./unshell.png) shell

> Set your shell free !

Combine the flexibility of a programming language with the knowledge of shell command.
As developer, sometimes, we need to run shell scripts. It will be cool to do so with the familiarity of a programming language.
An an ops, sometimes, we need to run complex shell scripts. It will be cool to do so with the power of a programming language.

## Features

* **Light**: There are no dependencies
* **Easy**: A small abstraction over `child_process`
* **Async**: Work with async/await command

## Setup

Execute script through Shell
```sh
npm install -g unshell
```

Embedded script inside apps
```sh
npm install unshell
```

## Usage

### Execute script through Shell
```
Execute script through unshell runtime

Usage:
  unshell COMMAND [SCRIPT_PATH] [ARGS...]

Commands:
  help      Print this help message
  run       run a script through unshell runtime
```

Given the script: `pause.js` to pause all docker containers
```js
module.exports = function * pause () {
  const ids = yield * fetchContainerIds()

  for(const id of ids) {
    yield `docker pause ${id}`
  }
}

function * fetchContainerIds () {
  const ids = yield `docker ps -q --no-trunc`

  return ids.split('\n').filter(Boolean)
}
```

Run it through unshell
```sh
unshell run pause.js
```

### Embedded script inside apps
Given the precedent script `pause.js`
Run it with `zeit/micro`
```js
module.exports = (req, res) => {
  const unshell = require('unshell')({env: process.env})

  try {
    unshell('./scripts/pause.js')

    res.end('OK')
  } catch (err) {
    res.end('NOK')
  }
}
```

## Examples
Here is some examples of what you can do with unshell
- [Pause containers](examples/pause-resume-container)

## Contribute
 Please check out the issues labeled `help wanted` or `good-first-issue`. Try npx good-first-issue unshell

## License

The code is available under the [MIT license](LICENSE).
