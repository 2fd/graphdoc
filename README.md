# Static page generator for documenting GraphQL Schema

![npm (scoped)](https://img.shields.io/npm/v/@2fd/graphdoc.svg?style=flat-square)
![GitHub tag](https://img.shields.io/github/tag/2fd/graphdoc.svg?style=flat-square)

## Demos

* Facebook Test [Star Wars](https://2fd.github.io/graphdoc/star-wars)
* [Github GraphQL](https://2fd.github.io/graphdoc/github)

## Install

```bash
    npm install -g @2fd/graphdoc
```

## Use

### Generate documentation from live endpoint

```bash
    > graphdoc -e http://localhost:8080/graphql -o ./doc/schema
```

### Generate documentation from json file

```bash
    > graphdoc -s ./schema.json -o ./doc/schema
```

> `./schema.json` contains the result of [GraphQL instrospection query](https://github.com/2fd/graphdoc/blob/gh-pages/introspection.graphql)

### Help

```bash

    > graphdoc -h

    Static page generator for documenting GraphQL Schema v1.2.0

    Usage: graphdoc [OPTIONS]

    [OPTIONS]:
    -c, --config      Configuration file [./package.json].
    -e, --endpoint    Graphql http endpoint ["https://domain.com/graphql"].
    -x, --header      HTTP header for request (use with --endpoint). ["Authorization=Token cb8795e7"].
    -q, --query       HTTP querystring for request (use with --endpoint) ["token=cb8795e7"].
    -s, --schema      Graphql Schema file ["./schema.json"].
    -p, --plugin      Use plugins [default=graphdoc/plugins/default].
    -t, --template    Use template [default=graphdoc/template/slds].
    -o, --output      Output directory.
    -b, --base-url    Base url for templates.
    -f, --force       Delete outputDirectory if exists.
    -v, --verbose     Output more information.
    -V, --version     Show graphdoc version.
    -h, --help        Print this help

```
