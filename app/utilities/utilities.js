// ================================================================== //
//         HELPFUL FUNCTIONS TO BE REUSED AROUND THE APP              //
//                                                                    //
//    1. Import the file to the location you want to use a function   //
//          let utilities = require('../utilities/utilities');        //
//                                                                    //    
//    2. Call the function:                                           //
//          utilities.randomString(4)                                 //
//                                                                    //
// ================================================================== //

// GENERATE A UNIQUE STRING (LETTERS/NUMBERS) OF XX CHARACTERS
// Input 1: Number of characters
// Output: Generated String
exports.randomString = (chars) => {
  return Math.random().toString(36).substring(2, chars + 2).toUpperCase();
};

// GENERATE A RANDOM INTEGER BETWEEN MIN AND MAX (BORDERS INCLUDED)
// Input 1: Two integers
// Output: Generated Integer
exports.randomIntBetween = (min,max) => {
  return Math.floor(Math.random()*(max-min+1)+min);
}

// FIND ELEMENT BY PROPERTY VALUE IN AN ARRAY OF OBJECTS
// Input 1: Array of Objects
// Input 2: Property name
// Input 3: Property value
// Output:  The first element matched or FALSE
exports.findElement = (arrayOfObjects, propertyName, propertyValue) => {
  let arrayLength = arrayOfObjects.length;
  
  for (let i = 0; i < arrayLength; i++) {
      
    console.log(`Checking if ${arrayOfObjects[i][propertyName]} == ${propertyValue}: ${arrayOfObjects[i][propertyName] == propertyValue}`)
    if (arrayOfObjects[i][propertyName] == propertyValue) {
      return arrayOfObjects[i];
    }
  }
  return false;
}