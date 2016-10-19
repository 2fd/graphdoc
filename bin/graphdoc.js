#!/usr/bin/env node

"use strict";
var command_1 = require('@2fd/command');
var command_2 = require('../lib/command');
(new command_2.GraphQLDocumentor)
    .handle(new command_1.ArgvInput(process.argv), new command_1.ColorConsoleOutput);