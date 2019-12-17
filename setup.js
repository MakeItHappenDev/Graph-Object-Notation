import Reference from './reference'

const setup = (options) => {
  const {references = {},path = ["references"]} = options

  //Import refs
  let knownObjects = new Map()
  const refs = {...references}

  const keys = Object.keys(refs)
  keys.forEach(k=>{
    knownObjects.set(refs[k],k)
  })

  const usedObjects = new Map()



  //Create functionnal generator
  const generator = function* (start = 61440){
    for(let i = start;i<Infinity;i++){
      yield `0x${i.toString(16)}`
    }
  }
  const generate = generator(61440)

  //Type of expected return
  return (type = "object") => {
    if(type === "map"){
      return usedObjects
    }
    else if(type === "references"){
      //Generate from usedObjects
      const usedRefs = {}
      for(let [value,key] of usedObjects){
        usedRefs[key] = value
      }
      return usedRefs
    }
    else if(type === "allReferences"){
      return refs
    }
    else{
      return object => {
        let address
        if(usedObjects.has(object)){
          address = usedObjects.get(object)
        }
        else{
          //Check if object is known
          if(knownObjects.has(object)){
            address = knownObjects.get(object)
          }
          else{
            //Ensure uniqueness 
            //maybe this should be in the generator function
            do{ address = generate.next().value }
            while(refs[address] !== undefined)
          }
          //build the refs
          refs[address] = object
          usedObjects.set(object,address)
        }
        return new Reference([...path,address])
      }
    }
  }
}
export default setup