# Static page generator for documenting GraphQL Schema

[![Build Status](https://travis-ci.org/2fd/graphdoc.svg?branch=master)](https://travis-ci.org/2fd/graphdoc)
![npm (scoped)](https://img.shields.io/npm/v/@2fd/graphdoc.svg?style=flat-square)
![GitHub tag](https://img.shields.io/github/tag/2fd/graphdoc.svg?style=flat-square)

## Demos

* Facebook Test [Star Wars](https://2fd.github.io/graphdoc/star-wars)
* [Github GraphQL](https://2fd.github.io/graphdoc/github)
* [Pokemon GraphQL](https://2fd.github.io/graphdoc/pokemon)

## Install

```bash
    npm install -g @2fd/graphdoc
```

## Use

### Generate documentation from live endpoint

```bash
    > graphdoc -e http://localhost:8080/graphql -o ./doc/schema
```

### Generate documentation from IDL file

```bash
    > graphdoc -s ./schema.graphql -o ./doc/schema
```

### Generate documentation from for the ["modularized schema"](http://dev.apollodata.com/tools/graphql-tools/generate-schema.html#modularizing) of graphql-tools

```bash
    > graphdoc -s ./schema.js -o ./doc/schema
```

> [`./schema.graphql`](https://github.com/2fd/graphdoc/blob/master/test/starwars.graphql) must be able to be interpreted with [graphql-js/utilities#buildSchema](http://graphql.org/graphql-js/utilities/#buildschema)


### Generate documentation from json file

```bash
    > graphdoc -s ./schema.json -o ./doc/schema
```

> `./schema.json` contains the result of [GraphQL introspection query](https://github.com/2fd/graphdoc/blob/gh-pages/introspection.graphql)

### Puts the options in your `package.json`

```javascript
     // package.json

    {
        "name": "project",
        // [...]
        "graphdoc": {
            "endpoint": "http://localhost:8080/graphql",
            "output": "./doc/schema",
        }
    }
```

And execute

```bash
    > graphdoc
```

### Help

```bash

    > graphdoc -h

    Static page generator for documenting GraphQL Schema v1.2.0

    Usage: graphdoc [OPTIONS]

    [OPTIONS]:
    -c, --config      Configuration file [./package.json].
    -e, --endpoint    Graphql http endpoint ["https://domain.com/graphql"].
    -x, --header      HTTP header for request (use with --endpoint). ["Authorization: Token cb8795e7"].
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

## Plugin

In graphdoc a plugin is simply an object that controls the content that is displayed
on every page of your document.

This object should only implement the `PluginInterface`.

```typescript

    /**
     * PluginInterface
     */
    export interface PluginInterface {

        /**
        * Return  section elements that is going to be
        * inserted into the side navigation bar.
        *
        * @example plain javascript:
        * [
        *  {
        *      title: 'Schema',
        *      items: [
        *          {
        *              text: 'Query',
        *              href: './query.doc.html',
        *              isActive: false
        *          },
        *          // ...
        *  }
        *  // ...
        * ]
        *
        * @example with graphdoc utilities:
        * import { NavigationSection, NavigationItem } from 'graphdoc/lib/utility';
        *
        * [
        *  new NavigationSection('Schema', [
        *      new NavigationItem('Query', ./query.doc.html', false)
        *  ]),
        *  // ...
        * ]
        *
        * @param {string} [buildForType] -
        *  the name of the element for which the navigation section is being generated,
        *  if it is `undefined it means that the index of documentation is being generated
        */
        getNavigations?: (buildForType?: string) => NavigationSectionInterface[] | PromiseLike<NavigationSectionInterface[]>;

        /**
        * Return  section elements that is going to be
        * inserted into the main section.
        *
        * @example plain javascript:
        * [
        *  {
        *      title: 'GraphQL Schema definition',
        *      description: 'HTML'
        *  },
        *  // ...
        * ]
        *
        * @example with graphdoc utilities:
        * import { DocumentSection } from 'graphdoc/lib/utility';
        *
        * [
        *  new DocumentSection('GraphQL Schema definition', 'HTML'),
        *  // ...
        * ]
        *
        * @param {string} [buildForType] -
        *  the name of the element for which the navigation section is being generated,
        *  if it is `undefined it means that the index of documentation is being generated
        *
        */
        getDocuments?: (buildForType?: string) => DocumentSectionInterface[] | PromiseLike<DocumentSectionInterface[]>;

        /**
        * Return a list of html tags that is going to be
        * inserted into the head tag of each page.
        *
        * @example
        *  [
        *      '<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>',
        *      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
        *  ]
        */
        getHeaders?: (buildForType?: string) => string[] | PromiseLike<string[]>;

        /**
        * Return a list of abasolute path to files that is going to be
        * copied to the assets directory.
        *
        * Unlike the previous methods that are executed each time that a page generated,
        * this method is called a single time before starting to generate the documentation
        *
        * @example
        * [
        *  '/local/path/to/my-custom-style.css',
        *  '/local/path/to/my-custom-image.png',
        * ]
        *
        * there's will be copied to
        * /local/path/to/my-custom-style.css -> [OUTPUT_DIRETORY]/assets/my-custom-style.css
        * /local/path/to/my-custom-image.png -> [OUTPUT_DIRETORY]/assets/my-custom-image.png
        *
        * If you want to insert styles or scripts to the documentation,
        * you must combine this method with getHeaders
        *
        * @example
        * getAssets(): ['/local/path/to/my-custom-style.css']
        * getHeaders(): ['<link href="assets/my-custom-style.css" rel="stylesheet">']
        */
        getAssets?: () => string[] | PromiseLike<string[]>;
    }
```

### Make a Plugin

To create your own plugin you should only create it as a `plain object`
or a `constructor` and export it as `default`

If you export your plugin as a constructor, when going to be initialized,
will receive three parameters

* `schema`: The full the result of [GraphQL instrospection query](https://github.com/2fd/graphdoc/blob/gh-pages/introspection.graphql)
* `projectPackage`: The content of `package.json` of current project (or the content of file defined with `--config` flag).
* `graphdocPackag`: The content of `package.json` of graphdoc.

> For performance reasons all plugins receive the reference to the same object
> and therefore should not modify them directly as it could affect the behavior
> of other plugins (unless of course that is your intention)

#### Examples

```typescript

    // es2015 export constructor
    export default class MyPlugin {
        constructor(schema, projectPackage, graphdocPackag){}
        getAssets() { /* ... */ }
        /* ... */
    }

```

```typescript
    // es2015 export plain object
    export default cost myPlugin = {
        getAssets() { /* ... */ },
        /* ... */
    }
```

```javascript

    // export constructor
    function MyPlugin(schema, projectPackage, graphdocPackage) { /* ... */ }

    MyPlugin.prototype.getAssets =  function() { /* ... */ };
    /* ... */

    exports.default = MyPlugin;
```

```javascript

    // export plain object

    exports.default = {
        getAssets: function() { /* ... */ },
        /* ... */
    }

```

### Use plugin

You can use the plugins in 2 ways.


#### Use plugins with command line

```bash
    > graphdoc  -p graphdoc/plugins/default \
                -p some-dependencie/plugin \
                -p ./lib/plugin/my-own-plugin \
                -s ./schema.json -o ./doc/schema
```

#### Use plugins with `package.json`

```javascript
     // package.json

    {
        "name": "project",
        // [...]
        "graphdoc": {
            "endpoint": "http://localhost:8080/graphql",
            "output": "./doc/schema",
            "plugins": [
                "graphdoc/plugins/default",
                "some-dependencie/plugin",
                "./lib/plugin/my-own-plugin"
            ]
        }
    }
```

### Build-in plugin

> TODO

## Template

> TODO
