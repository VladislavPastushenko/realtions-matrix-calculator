import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

// Example of result
const mockResult = {
    steps: [
        [[0.6, 0.5, 0.4,0], [0.5, 0.8, 0.1,0],[0.4, 0.1, 0.6,0], [0.4, 0.1, 0.6,0]],
     //   [[0, 0, 0], [0, 0, 0],[0, 0, 0]],
     //   [[0.6, 0.2], [0.2, 0.2]],
     //   [[0.2, 0.2], [0.2, 0.2]],
      ],
    resultMatrix: [[0, 1, 2,6], [3, 4, 5,0], [6, 7, 8,0], [6, 7, 8,0]],
    result: true,
  }
  let transitFlag = false; 
  let equal = true; 
  const myArray = [];
  const closure = [];
  let rowValue = 0;
  let i = 3;
  const initialization = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

export const METHOD_OF_CALCULATION = {
    MIN_T_NORM: "MIN_T_NORM",
    MULTIPLYING_T_NORM: "MULTIPLYING_T_NORM",
    LUKASIEWICZ_T_NORM: "LUKASIEWICZ_T_NORM",
    DRASTICKY_T_NORM: "DRASTICKY_T_NORM",
}

function createArrayOfArrays(n) {
    let result = [];
    for (let i = 0; i < n; i++) {
      let subArray = [];
      for (let j = 0; j < n; j++) {
        subArray.push(0);
      }
      result.push(subArray);
    }
    return result;
}

function matrixPower(firstStep, i){
        equal = true;
        mockResult.steps.push(initialization);
        console.log("delam" + i + "krok");
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        rowValue = Math.min(mockResult.steps[i-3][a][c], mockResult.steps[i-2][c][b]);
                        myArray.push(rowValue);
                    }
                    mockResult.steps[i-1][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                if(mockResult.steps[i-2][a][b]!= mockResult.steps[i-1][a][b]){
                    equal = false; 
                }
            }
        }
}
function transitiveClosure(firstStep){
    if (equal== true){
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 0; c < mockResult.steps.length; c++) {
                    rowValue = mockResult.steps[c][a][b];
                    myArray.push(rowValue);
                }
                mockResult.resultMatrix[a][b] = Math.max((Math.max.apply(Math, myArray)),firstStep[a][b]);
                while(myArray.length > 0)
                        myArray.pop();
                }
            }
        }
        return mockResult;
    }
// VIKA TODO:
/**
 * @param {Array.Number[]} firstStep - First step matrix, for example [[0.2, 0.2], [0.2, 0.2]]
 * @param {String} method - Method of calculation
 * @param {Number} iterationsLimit - Max number of iterations
 * @param {Number} size - matrix size 
 * @returns {Object}
 */
function calculateMatrix(firstStep, method=METHOD_OF_CALCULATION.MIN_T_NORM, iterationsLimit = 15, size) {
    switch(method) {
        case METHOD_OF_CALCULATION.MIN_T_NORM:
            console.log(firstStep.length);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        rowValue = Math.min(firstStep[a][c], firstStep[c][b]);
                        myArray.push(rowValue);
                    }
                    mockResult.steps[0][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
             for (let a = 0; a < firstStep.length; a++) {
                 for (let b = 0; b < firstStep[a].length; b++) {
                      if(firstStep[a][b]< mockResult.steps[0][a][b])
                        transitFlag = true; 
                 }
             }
            console.log(transitFlag);
            if (transitFlag == false){
                mockResult.resultMatrix = firstStep;
                return mockResult;
            }

            else {
            mockResult.steps.push(initialization);
            console.log("delam 2 krok");
                for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                        for (let c = 0; c < firstStep[a].length; c++) {
                            rowValue = Math.min(firstStep[a][c], mockResult.steps[0][c][b]);
                            myArray.push(rowValue);
                        }
                        mockResult.steps[1][a][b] = Math.max.apply(Math, myArray);
                        while(myArray.length > 0) 
                            myArray.pop();
                    }
                }
        }
                console.log(mockResult.steps);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                if(mockResult.steps[0][a][b]!= mockResult.steps[1][a][b]){
                   equal = false; 
                 }
            }
        }
        console.log(equal);
         if (equal== true){
            console.log("ooooooperace jsou rovnake");
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b]);
                     mockResult.resultMatrix[a][b] = a1;
                }
            }
            return mockResult;
         }
            while(equal === false){
                matrixPower(firstStep,i);
                if (equal) {
                    transitiveClosure(firstStep);
                    break;
                  }
            
            }
            return mockResult
            break

        case METHOD_OF_CALCULATION.MULTIPLYING_T_NORM:

        let transit = false; 
        let equals = true; 
  console.log(mockResult.steps);
        console.log(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                let a1 = firstStep[a][0]* firstStep[0][b];
                let b1 = firstStep[a][1]* firstStep[1][b];
                let c1 = firstStep[a][2]* firstStep[2][b];
                let d1 = firstStep[a][3]* firstStep[3][b];
        //         console.log(mockResult.steps[0][0]);
                mockResult.steps[0][a][b] = Math.max(a1, b1, c1,d1);
            }
        }
        console.log(mockResult.steps);

        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(firstStep[a][b]< mockResult.steps[0][a][b]){
                    transit = true; 
                 }
            }
        }
   //     console.log(transitFlag);
        if (transit == false){
            mockResult.resultMatrix = firstStep;
            console.log("hello");
            return mockResult;
        }
         else {
            console.log(mockResult.steps);

            console.log("byyyyyy");
            mockResult.steps[1] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
            console.log("delam 3 krok");
                for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                        let a1 = firstStep[a][0]* mockResult.steps[0][0][b];
                        let b1 = firstStep[a][1]* mockResult.steps[0][1][b];
                        let c1 = firstStep[a][2]* mockResult.steps[0][2][b];
                        let d1 = firstStep[a][3]* mockResult.steps[0][3][b];
                        mockResult.steps[1][a][b] = Math.max(a1, b1, c1, d1);
                    }
                }
            }

            console.log(mockResult.steps);
    for (let a = 0; a < firstStep.length; a++) {
        for (let b = 0; b < firstStep[a].length; b++) {
             if(mockResult.steps[0][a][b]!= mockResult.steps[1][a][b]){
                equals = false; 
             }
        }
    }
    console.log(equals);
    // }
     if (equals== true){
        console.log(mockResult.steps);
        console.log("ooooooperace jsou rovnake");
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b]);
                console.log(firstStep[a][b]+ "first");
                console.log(mockResult.steps[0][a][b] +"second");
                console.log(mockResult.steps[1][a][b]+ "tri");
                //console.log(mockResult.resultMatrix[a][b]);
                 mockResult.resultMatrix[a][b] = a1;
            }
        }
        return mockResult;
     }
         
     else {
     //   equal= true;
        mockResult.steps[2] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
        console.log("delam 4 krok");
        console.log(mockResult.steps[2]);
             for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                   let a1 = mockResult.steps[0][a][0]* mockResult.steps[1][0][b];
                   let b1 = mockResult.steps[0][a][1]* mockResult.steps[1][1][b];
                   let c1 = mockResult.steps[0][a][2]* mockResult.steps[1][2][b];
                   let d1 = mockResult.steps[0][a][3]* mockResult.steps[1][3][b];
                mockResult.steps[2][a][b] = Math.max(a1, b1, c1, d1);
                }
            }
        }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(mockResult.steps[1][a][b]!= mockResult.steps[2][a][b]){
                    equals = false; 
                 }
            }
        }
        console.log(equals);
        // }
         if (equals== true){
            console.log("operace jsou rovnake");
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b],mockResult.steps[1][a][b]);
                     mockResult.resultMatrix[a][b] = a1;
                     return mockResult;
                }
            }
         }
         else {
            mockResult.steps[3] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
            console.log("delam 5 krok");
                 for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                       let a1 = mockResult.steps[1][a][0]* mockResult.steps[2][0][b];
                       let b1 = mockResult.steps[1][a][1]* mockResult.steps[2][1][b];
                       let c1 = mockResult.steps[1][a][2]* mockResult.steps[2][2][b];
                       let d1 = mockResult.steps[1][a][3]* mockResult.steps[2][3][b];
                        mockResult.steps[3][a][b] = Math.max(a1, b1, c1, d1);
                    }
                }
         }
         for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(mockResult.steps[2][a][b]!= mockResult.steps[3][a][b]){
                    equals = false; 
                 }
            }
        }
        console.log(equals);
        // }
         if (equals!= true){
            console.log("2 a 3 operace jsou rovnake");
      //      console.log(mockResult.resultMatrix);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    console.log(firstStep[a].length);
                    let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b],mockResult.steps[2][a][b],mockResult.steps[3][a][b]);
                    console.log(a1);
                  //  mockResult.resultMatrix[a][b] = a1;
                 //   return mockResult;

                }
            }
         }
            return mockResult
            break
        case METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM:
        let transitivite = false; 
        let rovne = true; 
  //      mockResult.steps.push(firstStep);
  console.log(mockResult.steps);
        console.log(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                let a1 = firstStep[a][0]+ firstStep[0][b] -1;
                let b1 = firstStep[a][1]+ firstStep[1][b] -1;
                let c1 = firstStep[a][2]+ firstStep[2][b]-1;
                let d1 = firstStep[a][3]+ firstStep[3][b]-1;
        //         console.log(mockResult.steps[0][0]);
                mockResult.steps[0][a][b] = Math.max(a1, b1, c1,d1);
            }
        }
        console.log(mockResult.steps);

        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(firstStep[a][b]< mockResult.steps[0][a][b]){
                    transitivite = true; 
                 }
            }
        }
   //     console.log(transitFlag);
        if (transitivite == false){
            mockResult.resultMatrix = firstStep;
            console.log("hello");
            return mockResult;
        }
         else {
            console.log(mockResult.steps);

            console.log("byyyyyy");
            mockResult.steps[1] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
            console.log("delam 3 krok");
                for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                        let a1 = firstStep[a][0]+ mockResult.steps[0][0][b]-1;
                        let b1 = firstStep[a][1]+ mockResult.steps[0][1][b]-1;
                        let c1 = firstStep[a][2]+ mockResult.steps[0][2][b]-1;
                        let d1 = firstStep[a][3]+ mockResult.steps[0][3][b]-1;
                        mockResult.steps[1][a][b] = Math.max(a1, b1, c1, d1);
                    }
                }
            }

            console.log(mockResult.steps);
    for (let a = 0; a < firstStep.length; a++) {
        for (let b = 0; b < firstStep[a].length; b++) {
             if(mockResult.steps[0][a][b]!= mockResult.steps[1][a][b]){
                rovne = false; 
             }
        }
    }
    console.log(rovne);
    // }
     if (rovne== true){
        console.log(mockResult.steps);
        console.log("ooooooperace jsou rovnake");
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b]);
                console.log(firstStep[a][b]+ "first");
                console.log(mockResult.steps[0][a][b] +"second");
                console.log(mockResult.steps[1][a][b]+ "tri");
                //console.log(mockResult.resultMatrix[a][b]);
                 mockResult.resultMatrix[a][b] = a1;
            }
        }
        return mockResult;
     }
         
     else {
     //   equal= true;
        mockResult.steps[2] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
        console.log("delam 4 krok");
        console.log(mockResult.steps[2]);
             for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                   let a1 = mockResult.steps[0][a][0]+ mockResult.steps[1][0][b]-1;
                   let b1 = mockResult.steps[0][a][1]+ mockResult.steps[1][1][b]-1;
                   let c1 = mockResult.steps[0][a][2]+ mockResult.steps[1][2][b]-1;
                   let d1 = mockResult.steps[0][a][3]+ mockResult.steps[1][3][b]-1;
                    mockResult.steps[2][a][b] = Math.max(a1, b1, c1, d1);
                }
            }
        }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(mockResult.steps[1][a][b]!= mockResult.steps[2][a][b]){
                    rovne = false; 
                 }
            }
        }
        console.log(rovne);
        // }
         if (rovne== true){
            console.log("operace jsou rovnake");
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b],mockResult.steps[1][a][b]);
                     mockResult.resultMatrix[a][b] = a1;
                     return mockResult;
                }
            }
         }
         else {
            mockResult.steps[3] = [[0, 0, 0,0], [0, 0, 0,0],[0, 0, 0,0], [0, 0, 0,0]];
            console.log("delam 5 krok");
                 for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                       let a1 = mockResult.steps[1][a][0]+! mockResult.steps[2][0][b]-1;
                       let b1 = mockResult.steps[1][a][1]+ mockResult.steps[2][1][b]-1;
                       let c1 = mockResult.steps[1][a][2]+ mockResult.steps[2][2][b]-1;
                       let d1 = mockResult.steps[1][a][3]+ mockResult.steps[2][3][b]-1;
                        mockResult.steps[3][a][b] = Math.max(a1, b1, c1, d1);
                    }
                }
         }
         for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                 if(mockResult.steps[2][a][b]!= mockResult.steps[3][a][b]){
                    rovne = false; 
                 }
            }
        }
        console.log(rovne);
        // }
         if (rovne!= true){
            console.log("2 a 3 operace jsou rovnake");
      //      console.log(mockResult.resultMatrix);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    console.log(firstStep[a].length);
                    let a1 = Math.max(firstStep[a][b], mockResult.steps[0][a][b],mockResult.steps[1][a][b],mockResult.steps[2][a][b],mockResult.steps[3][a][b]);
                    console.log(a1);
                  //  mockResult.resultMatrix[a][b] = a1;
                 //   return mockResult;

                }
            }
         }
            return mockResult
            break
        case METHOD_OF_CALCULATION.DRASTICKY_T_NORM:
            return mockResult
            break
    }
}

export default calculateMatrix