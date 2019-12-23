import Reference from './reference'

/* Need to optimize this one, there must be a way to accelerate

function parse(str) {
  let i = 0;
  const references = [];
  ...
  function parseReference(){
    ...
      references.push(thisRef);
      return thisRef;
  }
  but cant update the ref in the object itself from that list
*/

const reReference = (object, bank = object) => {
  if (object instanceof Array) {
    for (let i = 0; i < object.length; i++) {
      //Don't go recursive for primitives
      if (typeof object[i] === "object") {
        if (object[i] instanceof Reference) {
          object[i] = object[i].getValue(bank);
        } else {
          reReference(object[i], bank);
        }
      }
    }
  } else if (object instanceof Object) {
    Object.keys(object).forEach(function(key) {
      if (object[key] && typeof object[key] === "object") {
        if (object[key] instanceof Reference) {
          object[key] = object[key].getValue(bank); // populate list
        } else {
          reReference(object[key], bank); // traverse recursively
        }
      }
    });
  } else {
    //console.log("I'm in a primitive", object);
    //Should never be the case, except for null values
  }
  return object;
};

function parse(str) {
  let i = 0;
  const references = [];

  const object = parseValue();

  reReference(object);
  //for(let i = 0;i<references.length;i++){
  //  references[i] = references[i].getValue(object)
  //}


  return object;

  function parseObject() {
    if (str[i] === "{") {
      i++;
      skipWhitespace();

      const result = {};

      let initial = true;
      // if it is not '}',
      // we take the path of string -> whitespace -> ':' -> value -> ...
      while (str[i] !== "}") {
        if (!initial) {
          eatComma();
          skipWhitespace();
        }
        const key = parseString();
        skipWhitespace();
        eatColon();
        const value = parseValue();
        result[key] = value;
        initial = false;
      }
      // move to the next character of '}'
      i++;

      return result;
    }
  }

  function parseArray() {
    if (str[i] === "[") {
      i++;
      skipWhitespace();

      const result = [];
      let initial = true;
      while (str[i] !== "]") {
        if (!initial) {
          eatComma();
        }
        const value = parseValue();
        result.push(value);
        initial = false;
      }
      // move to the next character of ']'
      i++;
      return result;
    }
  }
  function parseReference() {
    if (str[i] === "@") {
      i++;
      skipWhitespace();

      let string = "";
      while (str[i] !== "@") {
        if(str[i] === undefined){
          throw new Error('Unfinished reference @'+string)
        }
        string += str[i]
        i++
      }
      // move to the next character of ']'
      i++;

      //Add to the references array, to be treated before returning data
      const thisRef = new Reference(string.split('.'));
      references.push(thisRef);
      return thisRef;
    }
  }
  function parseDate(){
    if(str[i] === '|'){
      i++;
      skipWhitespace();
      let string = ""
      while(str[i] !== '|'){
        if(str[i] === undefined){
          throw new Error('Unfinished date |'+string)
        }
        string += str[i]
        i++
      }
      // move to the next character of '|'
      i++;
      return new Date(string)
    }
  }

  function parseSymbol(){
    if(str[i] === '±'){
      i++;
      skipWhitespace();
      let string = ""
      while(str[i] !== '±'){
        if(str[i] === undefined){
          throw new Error('Unfinished symbol ±'+string)
        }
        string += str[i]
        i++
      }
      // move to the next character of '|'
      i++;
      return Symbol.for(string)
    }
  }

  function parseValue() {
    skipWhitespace();
    const value =
      parseString() ||
      parseNumber() ||
      parseObject() ||
      parseArray() ||
      parseReference() ||
      parseDate() ||
      parseSymbol() ||
      parseKeyword("true", true) ||
      parseKeyword("false", false) ||
      parseKeyword("null", null);
    skipWhitespace();
    return value;
  }

  function parseKeyword(name, value) {
    if (str.slice(i, i + name.length) === name) {
      i += name.length;
      return value;
    }
  }

  function skipWhitespace() {
    while (
      str[i] === " " ||
      str[i] === "\n" ||
      str[i] === "\t" ||
      str[i] === "\r"
    ) {
      i++;
    }
  }

  function parseString() {
    if (str[i] === '"') {
      i++;
      let result = "";
      while (str[i] !== '"') {
        if(str[i] === undefined){
          throw new Error('Unfinished string "'+result)
        }
        
        if (str[i] === "\\") {
          const char = str[i + 1];
          if (
            char === '"' ||
            char === "\\" ||
            char === "/" ||
            char === "b" ||
            char === "f" ||
            char === "n" ||
            char === "r" ||
            char === "t"
          ) {
            result += char;
            i++;
          } else if (char === "u") {
            if (
              isHexadecimal(str[i + 2]) &&
              isHexadecimal(str[i + 3]) &&
              isHexadecimal(str[i + 4]) &&
              isHexadecimal(str[i + 5])
            ) {
              result += String.fromCharCode(
                parseInt(str.slice(i + 2, i + 6), 16)
              );
              i += 5;
            }
          }
        } else {
          result += str[i];
        }
        i++;
      }
      i++;
      return result;
    }
  }

  function isHexadecimal(char) {
    return (
      (char >= "0" && char <= "9") ||
      (char.toLowerCase() >= "a" && char.toLowerCase() <= "f")
    );
  }

  function parseNumber() {
    let start = i;
    if (str[i] === "-") {
      i++;
    }
    if (str[i] === "0") {
      i++;
    } else if (str[i] >= "1" && str[i] <= "9") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }

    if (str[i] === ".") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (str[i] === "e" || str[i] === "E") {
      i++;
      if (str[i] === "-" || str[i] === "+") {
        i++;
      }
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if(str[i] === "n"){
      //Prevent empty big int to grab value from keyword null
      if(start != i){
        i++
        return BigInt(str.slice(start, i-1))
      }
    }
    if (i > start) {
      return Number(str.slice(start, i));
    }
  }

  function eatComma() {
    if (str[i] !== ",") {
      throw new Error('Expected ",".');
    }
    i++;
  }
  function eatDot() {
    if (str[i] !== ".") {
      throw new Error('Expected ".".');
    }
    i++;
  }

  function eatColon() {
    if (str[i] !== ":") {
      throw new Error('Expected ":".');
    }
    i++;
  }
}

export default parse
