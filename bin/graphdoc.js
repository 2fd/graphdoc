#!/usr/bin/env node

"use strict";
const {
  ArgvInput,
  ColorConsoleOutput,
  ConsoleOutput
} = require("@2fd/command");
const { GraphQLDocumentGenerator } = require("../lib/command");
const argv = process.argv.filter(arg => arg !== "--no-color");
new GraphQLDocumentGenerator().handle(
  new ArgvInput(argv),
  argv.length === process.argv.length
    ? new ColorConsoleOutput()
    : new ConsoleOutput()
);
