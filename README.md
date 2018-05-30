# fb-nunjucks-helpers

Form Builder Nunjucks helpers

## Usage

### Set up

```
const fbNunjucksHelpers = require('fb-nunjucks-helpers')
let nunjucksEnv = nunjucks.configure(views, options)
nunjucksEnv = fbNunjucksHelpers.init(nunjucksEnv)

```

### Adding macros

```
nunjucksEnv.add(macroPaths)
```

Adding to a specific namespace

```
nunjucksEnv.add(macroPaths, namespace)
```

## Global methods available in Nunjucks templates

### callBlock

```
{{ callBlock(data) }}

{{ callBlock({
  _id: 'blockId;,
  _type: 'blockType',
  ...
}) }}
```

### callBlocks

```
{{ callBlocks([data, data2, data3]) }}
```

### callMacro

```
{{ callMacro(macroPath, data) }}
```

### setObject

```
{% set foo = setObject(foo, {prop: 'value'}) %}
```

### setObjectProperty

```
{% set foo = setObjectProperty(foo, 'prop', 'value') %}
```

### addGlobal

```
{% set varSink = addGlobal('globalProp', 'value') %}
```

## Test assets

The macro files used for testing are located in `lib/spec/macros`
