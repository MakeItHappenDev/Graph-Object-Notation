import setup from './setup'
import createReferences from '../lib/createReferences'
import Reference from './reference'

const indentSpaces = (space = 0) => {
  if(space === -1){return ''}
  if(space === 0){return '\n'}
  let indent = ''
  for(let i = 0;i<space;i++){
    indent += ' '
  }
  return `\n${indent}`
}

const serializeObject = (object,replacer,space) => {
  // TODO replacer

  let returnStr = []
  Object.keys(object).forEach(function(key) {
    returnStr.push(`"${key}": ${serialize(object[key],null,space>0?space+space:-1)}`)
  })
  return `{${indentSpaces(space)}${returnStr.join(`,${indentSpaces(space)}`)}${indentSpaces(space>0?Math.floor(space/2):-1)}}`
}

const serializeArray = (array, replacer, space) => {
  let returnStr = []
  for(let i=0;i<array.length;i++){
    returnStr.push(`${serialize(array[i],null,space>0?space+space:-1)}`)
  }
  return `[${indentSpaces(space)}${returnStr.join(`,${indentSpaces(space)}`)}${indentSpaces(space>0?Math.floor(space/2):-1)}]`
}

const serializeReference = (ref) => {
  return ref.toGON()
}

const serializeDate = (date) => {
  return `|${date.toISOString()}|`
}

const serialize = (object = {}, replacer= null, space = 0) => {
  // TODO Replacer not used yet


  //Looking for primitives/functions
  const typeOf = typeof object
  if(typeOf !== "object"){
    switch (typeOf) {
      case 'function':return 'Function(){}'
      case 'undefined':return 'null';
      case 'boolean':return object?'true':'false';
      case 'number':return `${object}`;
      case 'bigint':return `${object.toString()}n`;
      case 'string':return `"${object}"`;
      case 'symbol':return `±${Symbol.keyFor(object)}±`
      default:return typeOf;
    }

  }
  //Flavor of objects
  else{
    if (object === null){
      return 'null'
    }
    else if(object instanceof Array){
      return serializeArray(object, replacer, Number(space?space:-1))
    }
    else if(object instanceof Reference){
      return serializeReference(object)
    }
    else if(object instanceof Date){
      return serializeDate(object)
    }
    else if(object instanceof Object){
      return serializeObject(object, replacer, Number(space?space:-1))
    }
  }
}


const stringify = (object, replacer= null, space = 0, target = "references") => {

  const init = setup({
    path:[target]
    })
  const findRef = init("objects")

  let data = {}
  try{
    data["data"] = createReferences(object,findRef)
    data[target] = init("references")
  }
  catch(e){
    data:{error:e.toString()}
  }


  //return data


  return serialize(data, replacer, space)
}

export default stringify



