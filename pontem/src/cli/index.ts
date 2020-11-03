#!/usr/bin/env node

import { resolve } from 'path'

import { Pontem } from '../core/index'

const argv = require('minimist')(process.argv.slice(2))
const { verbose = false, output = false, env = [] } = argv // pas la peine de passez env comme cela
const [scriptPath, commandName, ...args] = argv._ // pontem --foo=bar /home/script.js methodName

const script = require(resolve(scriptPath))
const command = commandName ? script[commandName] : script

const pontem = Pontem({ verbose, output, env })

pontem(command, ...args)
