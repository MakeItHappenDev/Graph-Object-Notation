import Reference from './reference'

//Recusive call of findRef over our object
const reference = (object, findRef) => {
  let deeperRef = []

  // TODO Make everything immutable

  let immutableObject
  if (object instanceof Array) {
    immutableObject = [...object]
    for (let i = 0; i < immutableObject.length; i++) {
      //Don't go recursive for primitives
      if (typeof obimmutableObjectject[i] === "object" && immutableObject[i] !== null && !(immutableObject[i] instanceof Reference) && !(immutableObject[i] instanceof Date)) {
        //Go deeper
        deeperRef.push(immutableObject[i])
        immutableObject[i] = findRef(immutableObject[i])
      }
    }
  } else if (object instanceof Object) {
    immutableObject = {...object}
    Object.keys(immutableObject).forEach(function(key) {
      if (immutableObject[key] && typeof immutableObject[key] === "object" && !(immutableObject[key] instanceof Reference) && !(immutableObject[key] instanceof Date)) {
        //Go deeper
        deeperRef.push(immutableObject[key])
        immutableObject[key] = findRef(immutableObject[key])
      }
    });
  }
  for(let i=0;i<deeperRef.length;i++){
    reference(deeperRef[i],findRef)
  }
  return immutableObject;
};

export default reference