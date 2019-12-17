import Reference from './reference'

//Recusive call of findRef over our object
const reference = (object, findRef) => {
  let deeperRef = []
  if (object instanceof Array) {
    for (let i = 0; i < object.length; i++) {
      //Don't go recursive for primitives
      if (typeof object[i] === "object" && object[i] !== null && !(object[i] instanceof Reference) && !(object[i] instanceof Date)) {
        //Go deeper
        deeperRef.push(object[i])
        object[i] = findRef(object[i])
      }
    }
  } else if (object instanceof Object) {
    Object.keys(object).forEach(function(key) {
      if (object[key] && typeof object[key] === "object" && !(object[key] instanceof Reference) && !(object[key] instanceof Date)) {
        //Go deeper
        deeperRef.push(object[key])
        object[key] = findRef(object[key])
      }
    });
  }
  for(let i=0;i<deeperRef.length;i++){
    reference(deeperRef[i],findRef)
  }
  return object;
};

export default reference