function Reference(path = []) {
  this.path = path;
  this.getValue = object => {
    return findPath(object, this.path);
  };
  this.toJSON = () => {
    return `@${this.path.join('.')}@`
  };
  this.toGON = () => {
    return `@${this.path.join('.')}@`
  }
}

const undefinedPath = {}

const findPath = (current, path) => {
  try{
    path.forEach(p => {
      if(current[p] === undefined){
        throw undefinedPath
      }
      current = current[p];
    });
    return current;
  }
  catch(e){
    if(e !== undefinedPath) {throw e}
    return null
  }
};



export default Reference