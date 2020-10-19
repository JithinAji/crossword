// set up a function that iterates through a given array
// if one of the elements is an array, call itself with that element
// (Edited)
// if elements of the array is an object, we make sure to take care of that too.const deepCopy = (arr) => {
const deepCopy = (arr) => {
  let copy = [];
  arr.forEach((elem) => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem));
    } else {
      if (typeof elem === "object") {
        copy.push(deepCopyObject(elem));
      } else {
        copy.push(elem);
      }
    }
  });
  return copy;
};
// Helper function to deal with Objects
const deepCopyObject = (obj) => {
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === "object") {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value;
      }
    }
  }
  return tempObj;
};

export default deepCopy;
