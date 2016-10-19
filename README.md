# Static page generator for GraphQL.js

## Install

```bash
    npm install -g @2fd/graphdoc
```

## Use

```bash
    Static page generator for GraphQL.js v1.1.0

    Usage: node /home/fede/etc/node/node-v6.2.0-linux-x64/bin/graphdoc [OPTIONS] 

    [OPTIONS]:
    --config, -c      Configuration file [./package.json].
    --endpoint, -e    Graphql http enpoint ["https://domain.com/graphql"].
    --header, -x      HTTP header for request (use with --enpoint). ["Authorization=Token cb8795e7"].
    --query, -q       HTTP querystring for request (use with --enpoint) ["token=cb8795e7"].
    --schema, -s     Graphql Schema file ["./schema.json"].
    --plugin, -p      Use plugins [default=graphdoc/plugins/default].
    --template, -t    Use template [default=graphdoc/template/slds].
    --output, -o      Output directory.
    --base-url, -b    Base url for templates.
    --force, -f       Delete outputDirectory if exists.
    --verbose, -v     Output more information.
    --version, -V     Show graphdoc version.
    --help, -h        Print this help

```

## [Demo](https://2fd.github.io/graphdoc/star-wars)