# Graph Object Notation

ALPHA STATE WARNING, PLEASE DO NOT USE IN PRODUCTION, STUFF BREAKS ALL THE TIME

The goal of this package is to provide a way to serialize/parse graph objects with a syntax as close as possible to JSON.
The serialized data format is a superset of the JSON data format and holds the extension .gon

# How to install

```
npm install graph-object-notation --save
```

# How to use

```js
import GON from 'graph-object-notation'

const graph = GON.parse(`{
  "foo":{"name":"bar"},
  "ref":@foo@
}`)

console.log(JSON.stringify(graph))
// Returns {"foo":{"name":"bar"},"ref":{"name":"bar"}}

console.log(GON.stringify(graph))
// Returns {"data":{"foo":@references.0xf001@,"ref":@references.0xf001@},"references":{"0xf001":{"name":"bar"}}}

```

# Accepted serialization

GON is a superset of JSON, everything JSON should work using GON.parse
In addition to JSON, GON offers a few more serialization options: 

```
{
  "date":|2019-12-17T12:00:00.000Z|,
  "bigInt":42n,
  "Symbol":±debug±,
  "Reference":@bigInt@
}
```

# Import options

You can import the whole suite with `import GON from 'graph-object-notation` or just the part you need with `import {parse,stringify} from 'graph-object-notation'`

# GON.parse(stringToBeParsed)

Parse __stringToBeParsed__ in the GON format, resolve references and provide a JS object that can be a graph

# GON.stringify(objectToSerialize, replacer, spaces, target)

/!\ Stringify mutate the __objectToSerialize__ , this is a know bug and will be resolved later on

/!\ Stringify return a serialized version of your string on the form {"data":{...yourObject/array}, __target__:{...}}, if you want to stringify and parse in succession, you'll need to `GON.parse(GON.stringify({test:"hello"}).data` to get the expected result

Serialize __objectToSerialize__ to the GON format. default is `{}`

__replacer__ is not yet implemented and will work like the __replacer__ from JSON.stringify. default is `null` 

__space__ is used to make the serialized string more readable for human, works like __space__ from JSON.stringify, default is `0`

__target__ specify the property that will hold the references, default is `"references"`


# RoadMap

The goal is to provide a serialization for useful JS types of object/primitive, and graph supports.
Next versions will focus on :

 - Making stringify immutable
 - Adding tests for automatic deployements
 - Improved resiliency of the parse/stringify functions
 - Better optimization of the parse/stringify functions
 - Adding support for Maps and Sets
 - Adding support for single-quote/backquote notation for strings
 - Adding Conditionnal checks on toGON(), and toJSON() for unknown objects.
 - Adding logic for the replacer
