import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

// Example of result
const mockResult = {
    steps: [
    //    [[0.6, 0.5, 0.4, 0], [0, 0.5, 0.8, 0.1],[0, 0.4, 0.1, 0.6], [0, 0.4, 0.1, 0.6]],
     //   [[0, 0, 0], [0, 0, 0],[0, 0, 0]],
     //   [[0.6, 0.2], [0.2, 0.2]],
     //   [[0.2, 0.2], [0.2, 0.2]],
      ],
    resultMatrix: [],
    result: true,
  }
  let transitFlag = false; 
  let equal = true; 
  const myArray = [];
  let rowValue = 0;
  let i = 2;
  let limit = false;

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

function matrixEquality(i, limit){
    for (let a = 0; a < mockResult.steps[0].length; a++) {
        for (let b = 0; b < mockResult.steps[0][a].length; b++) {
            if(mockResult.steps[i-1][a][b]!= mockResult.steps[i-2][a][b]){
                console.log(mockResult.steps[i-1][a][b]);
                console.log(mockResult.steps[i-2][a][b]);
                equal = false; 
            }
            if(limit){
                if(Math.abs(mockResult.steps[i-1][a][b]- mockResult.steps[i-2][a][b] < 0.00001)){
                    equal = true; 
                }
            }
        }
    }
}

function matrixPower(firstStep, i, size, method, limit){
    equal = true;
    mockResult.steps.push(firstStep);
        console.log("delam" + i + "krok");
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        if (method == METHOD_OF_CALCULATION.MIN_T_NORM)
                            rowValue = Math.min(mockResult.steps[i-3][a][c], mockResult.steps[i-2][c][b]);
                        if (method == METHOD_OF_CALCULATION.MULTIPLYING_T_NORM)
                            rowValue = (mockResult.steps[i-3][a][c]* mockResult.steps[i-2][c][b]).toFixed(5);
                        if (method == METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM){
                            rowValue = Math.max((mockResult.steps[i-3][a][c] + mockResult.steps[i-2][c][b]-1), 0);
                            console.log(rowValue);
                        }
                        myArray.push(rowValue);
                    }
                    mockResult.steps[i-1][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
            matrixEquality(i, limit);
}
function minTransitiveClosure(firstStep){
    if (equal == true){
        mockResult.resultMatrix=createArrayOfArrays(firstStep.length);
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
function productTransitiveClosure(firstStep){
    if (equal == true){
    //    mockResult.steps.pop();
        mockResult.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                console.log(a + "a --- b" + b);
                console.log((firstStep[a][b] + mockResult.steps[0][a][b]));
                console.log((firstStep[a][b] * mockResult.steps[0][a][b]).toFixed(5));
                mockResult.resultMatrix[a][b] = ((firstStep[a][b] + mockResult.steps[0][a][b]) - (firstStep[a][b] * mockResult.steps[0][a][b]).toFixed(5));
                }
            }
            console.log(mockResult.steps.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < mockResult.steps.length-1; c++) {
                    console.log(a + "a --- b" + b);
                    console.log((mockResult.resultMatrix[a][b] + mockResult.steps[c][a][b]));
                    console.log((mockResult.resultMatrix[a][b] * mockResult.steps[c][a][b]).toFixed(5));
                    mockResult.resultMatrix[a][b] = ((mockResult.resultMatrix[a][b] + mockResult.steps[c][a][b]) - (mockResult.resultMatrix[a][b] * mockResult.steps[c][a][b]).toFixed(5));
                }
            }
        }
        return mockResult;
    }
}
function LukasTransitiveClosure(firstStep){
    if (equal == true){
       // mockResult.steps.pop();
        mockResult.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                console.log(a + "a --- b" + b);
                console.log((firstStep[a][b] + mockResult.steps[0][a][b]));
                console.log((firstStep[a][b] * mockResult.steps[0][a][b]).toFixed(5));
                mockResult.resultMatrix[a][b] = Math.min((firstStep[a][b] + mockResult.steps[0][a][b]), 1);
                }
            }
            console.log(mockResult.steps.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < mockResult.steps.length-1; c++) {
                    console.log(a + "a --- b" + b);
                    console.log((mockResult.resultMatrix[a][b] + mockResult.steps[c][a][b]));
                    console.log((mockResult.resultMatrix[a][b] * mockResult.steps[c][a][b]).toFixed(5));
                    mockResult.resultMatrix[a][b] = Math.min((mockResult.resultMatrix[a][b] + mockResult.steps[c][a][b]), 1);
                }
            }
        }
        return mockResult;
    }
}
function DrastTransitiveClosure(firstStep){
    if (equal == true){
       // mockResult.steps.pop();
        mockResult.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                console.log(a + "a --- b" + b);
                mockResult.resultMatrix[a][b] = Math.min(firstStep[a][b], mockResult.steps[0][a][b]) == 0 ? Math.max(firstStep[a][b], mockResult.steps[0][a][b]) : 1;
                }
            }
            console.log(mockResult.steps.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < mockResult.steps.length-1; c++) {
                    console.log(a + "a --- b" + b);
                    mockResult.resultMatrix[a][b] = Math.min(mockResult.resultMatrix[a][b], mockResult.steps[c][a][b] == 0 ? Math.max(mockResult.resultMatrix[a][b], mockResult.steps[c][a][b]) : 1);
                }
            }
        }
        return mockResult;
    }
}

// VIKA TODO:
/**
 * @param {Array.Number[]} firstStep - First step matrix, for example [[0.2, 0.2], [0.2, 0.2]]
 * @param {String} method - Method of calculation
 * @param {Number} iterationsLimit - Max number of iterations
 * @param {Number} size - matrix size 
 * @returns {Object}
 */
function calculateMatrix(firstStep, method=METHOD_OF_CALCULATION.DRASTICKY_T_NORM, iterationsLimit = 15, size) {
    switch(method) {
        case METHOD_OF_CALCULATION.MIN_T_NORM:
            mockResult.steps[0]=createArrayOfArrays(firstStep.length);
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
            mockResult.steps.push(firstStep);//sprosit
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
        matrixEquality(i, false);
        console.log(equal);
         if (equal== true)
            minTransitiveClosure(firstStep);
        i++;
        while(equal === false){
            matrixPower(firstStep,i,size, method,limit);
            i++;
            if (equal || i < 50) {
                minTransitiveClosure(firstStep);
                break;
                }
        }
            return mockResult
            break


        case METHOD_OF_CALCULATION.MULTIPLYING_T_NORM:
            const analogStep = firstStep;
            mockResult.steps[0]=createArrayOfArrays(firstStep.length);
            console.log(firstStep.length);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        rowValue = (firstStep[a][c] * firstStep[c][b]).toFixed(5);
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
                mockResult.steps.push(firstStep);//sprosit
                console.log("delam 2 krok");
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                rowValue = (firstStep[a][c]* mockResult.steps[0][c][b]).toFixed(3);
                                myArray.push(rowValue);
                            }
                            mockResult.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            matrixEquality(i,false);
            console.log(equal);
            if (equal == true)
                productTransitiveClosure(firstStep);
            i++;
            while(equal === false){
                matrixPower(firstStep,i,size, method, limit);
                i++;
                if (equal || i < 50) {
                    productTransitiveClosure(firstStep);
                    break;
                    }
                else if (i > 50){
                    limit = true;
                }
            }
            return mockResult
            break

        case METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM:
         //   const analogStep = firstStep;
            mockResult.steps[0]=createArrayOfArrays(firstStep.length);
            console.log(firstStep.length);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        console.log(firstStep[a][c] + firstStep[c][b]-1);
                        rowValue = Math.max(firstStep[a][c] + firstStep[c][b]-1, 0);
                        myArray.push(rowValue);
                    }
                    mockResult.steps[0][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
             for (let a = 0; a < firstStep.length; a++) {
                 for (let b = 0; b < firstStep[a].length; b++) {
                      if(firstStep[a][b] < mockResult.steps[0][a][b])
                        transitFlag = true; 
                 }
             }
            console.log(transitFlag);
            if (transitFlag == false){
                mockResult.resultMatrix = firstStep;
                return mockResult;
            }

            else {
                mockResult.steps.push(firstStep);//sprosit
                console.log("delam 2 krok");
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                rowValue = Math.max(firstStep[a][c] + mockResult.steps[0][c][b] - 1, 0);
                                myArray.push(rowValue);
                            }
                            mockResult.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            matrixEquality(i,false);
            console.log(equal);
            if (equal == true)
                LukasTransitiveClosure(firstStep);
            i++;
            while(equal === false){
                matrixPower(firstStep,i,size, method, limit);
                i++;
                if (equal || i < 50) {
                    LukasTransitiveClosure(firstStep);
                    break;
                    }
                else if (i > 50){
                    limit = true;
                }
            }
            return mockResult
            break
        case METHOD_OF_CALCULATION.DRASTICKY_T_NORM:
            mockResult.steps[0]=createArrayOfArrays(firstStep.length);
            console.log(firstStep.length);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        rowValue = Math.max(firstStep[a][c], firstStep[c][b]) == 1 ? Math.min(firstStep[a][c], firstStep[c][b]) : 0;
                        console.log(rowValue);
                        myArray.push(rowValue);
                    }
                    mockResult.steps[0][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
             for (let a = 0; a < firstStep.length; a++) {
                 for (let b = 0; b < firstStep[a].length; b++) {
                      if(firstStep[a][b] < mockResult.steps[0][a][b])
                        transitFlag = true; 
                 }
             }
            if (transitFlag == false){
                mockResult.resultMatrix = firstStep;
                return mockResult;
            }

            else {
                mockResult.steps.push(firstStep);//sprosit
                console.log("delam 2 krok");
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                rowValue = Math.max(firstStep[a][c], mockResult.steps[0][c][b]) == 1 ? Math.min(firstStep[a][c], mockResult.steps[0][c][b]) : 0;
                                myArray.push(rowValue);
                            }
                            mockResult.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            matrixEquality(i,false);
            console.log(equal);
            if (equal == true)
                DrastTransitiveClosure(firstStep);
            i++;
            while(equal === false){
                matrixPower(firstStep,i,size, method, limit);
                i++;
                if (equal) {
                    DrastTransitiveClosure(firstStep);
                    break;
                    }
            }
            return mockResult
            break
    }
}

export default calculateMatrix