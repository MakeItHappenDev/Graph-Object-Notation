const GON = require('../lib/index')
//console.log(GON.parse(`{"helloWorld":true}`))
//console.log(GON.parse(`{"helloWorld":null}`))


const objectToSerialize = {
  name:"arthur", 
  deeperObj:{
    name:"deep",
    nestedArray:[null,"test"]
  }, 
  deeperArray:[
    'test',
    {name:"nested"}
  ]
}

//console.log(`test createRef immutability:
//`)
//console.log(GON.stringify(objectToSerialize,null,1))
console.log(GON.stringify(objectToSerialize))
console.log(GON.stringify(objectToSerialize))