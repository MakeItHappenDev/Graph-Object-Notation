const GON = require('../lib/index')

console.log('')
console.log('test basic parse')
console.log(GON.parse(`{"helloWorld":true}`))
console.log(GON.parse(`{"helloWorld":null}`))
console.log('')

console.log(`test createRef object immutability:`)
const objectToSerialize = {name:"test",nest:{deep:[]},deep:[{nest:true}]}
console.log(GON.stringify(objectToSerialize))
console.log(GON.stringify(objectToSerialize))
console.log('')

console.log(`test createRef array immutability:`)
const arrayToSerialize = ["test",{deep:[]},[{nest:true}]]
console.log(GON.stringify(arrayToSerialize))
console.log(GON.stringify(arrayToSerialize))
console.log('')