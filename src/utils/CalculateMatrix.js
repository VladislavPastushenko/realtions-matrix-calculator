import { isLabelWithInternallyDisabledControl } from "@testing-library/user-event/dist/utils";

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
function checkTransitivity(method,firstStep,result){
    let rowValue = 0;
    let value = 0;
    let secondValue = 0;
    const myArray = [];
    let transitFlag = false
    result.steps[0] = createArrayOfArrays(firstStep.length);
    for (let a = 0; a < firstStep.length; a++) {
        for (let b = 0; b < firstStep[a].length; b++) {
            for (let c = 0; c < firstStep[a].length; c++) {
                    if (method == METHOD_OF_CALCULATION.MIN_T_NORM)
                        rowValue = Math.min(firstStep[a][c], firstStep[c][b]);
                    else if (method == METHOD_OF_CALCULATION.MULTIPLYING_T_NORM){
                        value = firstStep[a][c] * 1000
                        secondValue = firstStep[c][b] * 1000
                        rowValue = (value * secondValue) / 1000000;
                    } else if (method=METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM){
                        value = firstStep[a][c] * 1000
                        secondValue = firstStep[c][b]*1000
                        rowValue = Math.max(((value + secondValue)-1000)/1000, 0)
                    } else 
                        rowValue = Math.max(firstStep[a][c], firstStep[c][b]) == 1 ? Math.min(firstStep[a][c], firstStep[c][b]) : 0;
                    myArray.push(rowValue);
                }
            result.steps[0][a][b] = Math.max.apply(Math, myArray);
            while(myArray.length > 0)
                myArray.pop();
        }
    }
     for (let a = 0; a < firstStep.length; a++) {
         for (let b = 0; b < firstStep[a].length; b++) {
              if(firstStep[a][b]< result.steps[0][a][b])
                transitFlag = true; 
         }
     }

    return transitFlag
}
function matrixEquality(i, limit, equalMatrixes, result){
    equalMatrixes= true;
    for (let a = 0; a < result.steps[0].length; a++) {
        for (let b = 0; b < result.steps[0][a].length; b++) {
            if (limit){
                if(Math.abs(result.steps[i-1][a][b]- result.steps[i-2][a][b]) >= 0.00001){
                    equalMatrixes = false; 
                }
            }
            else if(result.steps[i-1][a][b]!= result.steps[i-2][a][b]){
                equalMatrixes = false; 
            }
            
        }
    }
    return equalMatrixes;
}

function matrixPower(firstStep, i, size, method, result){
    let rowValue = 0;
    let value = 0;
    let secondValue = 0;
    const myArray = [];
    const arr = createArrayOfArrays(firstStep.length);
    result.steps.push(arr);
            for (let a = 0; a < firstStep.length; a++) {
                for (let b = 0; b < firstStep[a].length; b++) {
                    for (let c = 0; c < firstStep[a].length; c++) {
                        if (method == METHOD_OF_CALCULATION.MIN_T_NORM)
                            rowValue = Math.min(result.steps[i-3][a][c], result.steps[i-2][c][b]);
                        else if (method == METHOD_OF_CALCULATION.MULTIPLYING_T_NORM){
                                value = result.steps[i-3][a][c] * 1000
                                secondValue = result.steps[i-3][c][b] * 1000
                                rowValue = (value * secondValue) / 1000000;
                        }     
                        else if (method == METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM){
                            value = result.steps[i-3][a][c]  * 1000
                            secondValue = result.steps[i-2][c][b]* 1000
                         rowValue = Math.max(((value + secondValue)-1000)/1000, 0);

                        }
                        else if (method == METHOD_OF_CALCULATION.DRASTICKY_T_NORM)
                            rowValue = Math.max(result.steps[i-3][a][c], result.steps[i-2][c][b]) == 1 ? Math.min(result.steps[i-3][a][c], result.steps[i-2][c][b]) : 0;
                        myArray.push(rowValue);
                    }
                    result.steps[i-1][a][b] = Math.max.apply(Math, myArray);
                    while(myArray.length > 0)
                        myArray.pop();
                }
            }
}
function minTransitiveClosure(firstStep, result){
  let rowValue = 0;
  const myArray = [];
        result.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 0; c < result.steps.length; c++) {
                    rowValue = result.steps[c][a][b];
                    myArray.push(rowValue);
                }
                result.resultMatrix[a][b] = Math.max((Math.max.apply(Math, myArray)),firstStep[a][b]);
                while(myArray.length > 0)
                        myArray.pop();
                }
            }
        return result;
    }
function productTransitiveClosure(firstStep, result){
    let value = 0;
    let secondValue = 0;
        result.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                value = firstStep[a][b] * 10000
                secondValue = result.steps[0][a][b] * 10000
                result.resultMatrix[a][b] = (((value + secondValue)/ 10000) - ((value * secondValue)/ 100000000));
                result.resultMatrix[a][b]  = parseFloat((result.resultMatrix[a][b]).toFixed(10))
                }
            }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < result.steps.length-1; c++) {
                    value = result.resultMatrix[a][b] * 10000
                    secondValue = result.steps[c][a][b] * 10000
                    result.resultMatrix[a][b] = (((value + secondValue)/ 10000) - ((value * secondValue)/ 100000000));
                    result.resultMatrix[a][b]  = parseFloat((result.resultMatrix[a][b]).toFixed(10))

                }
            }
        }
        return result;
}
function LukasTransitiveClosure(firstStep, result){
    let value = 0;
    let secondValue = 0;
        result.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                value = firstStep[a][b] * 100
                secondValue = result.steps[0][a][b] * 100
                result.resultMatrix[a][b] = Math.min(((value + secondValue)/100), 1);
                }
            }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < result.steps.length-1; c++) {
                    value = result.resultMatrix[a][b] * 100
                    secondValue = result.steps[c][a][b] * 100
                    result.resultMatrix[a][b] = Math.min(((value + secondValue)/100), 1);
                }
            }
        }
        return result;
}
function DrastTransitiveClosure(firstStep, result){
        result.resultMatrix=createArrayOfArrays(firstStep.length);
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                result.resultMatrix[a][b] = Math.min(firstStep[a][b], result.steps[0][a][b]) == 0 ? Math.max(firstStep[a][b], result.steps[0][a][b]) : 1;
                }
            }
        for (let a = 0; a < firstStep.length; a++) {
            for (let b = 0; b < firstStep[a].length; b++) {
                for (let c = 1; c < result.steps.length-1; c++) {
                    result.resultMatrix[a][b] = Math.min(result.resultMatrix[a][b], result.steps[c][a][b] == 0 ? Math.max(result.resultMatrix[a][b], result.steps[c][a][b]) : 1);
                }
            }
        }
        return result;
}

// VIKA TODO:
/**
 * @param {Array.Number[]} firstStep - First step matrix, for example [[0.2, 0.2], [0.2, 0.2]]
 * @param {String} method - Method of calculation
 * @param {Number} size - matrix size 
 * @returns {Object}
 */
function calculateMatrix(firstStep, method=METHOD_OF_CALCULATION.MIN_T_NORM, size) {
  let transitFlag = false; 
  let equalMatrixes  = true; 
  let rowValue = 0;
  let value = 0;
  let secondValue = 0;
  let limit = false;
  let iterationCount= 2;
  const myArray = [];

    const result = {
        steps: [],
        resultMatrix: [],
        result: true,
   }
  
    switch(method) {
        case METHOD_OF_CALCULATION.MIN_T_NORM:
            transitFlag = checkTransitivity(method, firstStep,result)
            if (transitFlag == false){
                result.resultMatrix = firstStep;
                return result;
            }

            else {
            const arr = createArrayOfArrays(firstStep.length);
            result.steps.push(arr);
                for (let a = 0; a < firstStep.length; a++) {
                    for (let b = 0; b < firstStep[a].length; b++) {
                        for (let c = 0; c < firstStep[a].length; c++) {
                            rowValue = Math.min(firstStep[a][c], result.steps[0][c][b]);
                            myArray.push(rowValue);
                        }
                        result.steps[1][a][b] = Math.max.apply(Math, myArray);
                        while(myArray.length > 0) 
                            myArray.pop();
                    }
                }
        }
        equalMatrixes = matrixEquality(iterationCount, false, equalMatrixes, result);
        if (equalMatrixes == true)
            minTransitiveClosure(firstStep, result);
        iterationCount++;
        while (equalMatrixes === false){
            matrixPower(firstStep,iterationCount, size, method, result);
            equalMatrixes = matrixEquality(iterationCount, limit, equalMatrixes, result);
            iterationCount++;
            if (equalMatrixes) {
                minTransitiveClosure(firstStep, result);
                break;
                }
        }
            return result
            break


        case METHOD_OF_CALCULATION.MULTIPLYING_T_NORM:

            transitFlag = checkTransitivity(method, firstStep,result)
            if (transitFlag == false){
                result.resultMatrix = firstStep;
                return result;
            }
            
            else {
                const arr = createArrayOfArrays(firstStep.length);
                result.steps.push(arr);
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                value = firstStep[a][c] * 1000
                                secondValue = result.steps[0][c][b] * 1000
                                rowValue = (value * secondValue) / 1000000;
                                myArray.push(rowValue);
                            }
                            result.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            equalMatrixes = matrixEquality(iterationCount, false, equalMatrixes, result);
            if (equalMatrixes == true)
                productTransitiveClosure(firstStep, result);
            iterationCount++;
            while(equalMatrixes === false){
                matrixPower(firstStep, iterationCount,size, method, result);
                equalMatrixes = matrixEquality(iterationCount, limit, equalMatrixes, result);
                iterationCount++;
                if (equalMatrixes) {
                    productTransitiveClosure(firstStep, result);
                    break;
                    }
                else if (iterationCount > 50){
                    limit = true;
                }
            }
            return result
            break

        case METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM:
            transitFlag = checkTransitivity(method, firstStep,result)
            if (transitFlag == false){
                result.resultMatrix = firstStep;
                return result;
            }

            else {
                const arr = createArrayOfArrays(firstStep.length);
                result.steps.push(arr);
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                value = firstStep[a][c] * 1000
                                secondValue = result.steps[0][c][b] * 1000
                                rowValue = Math.max(((value + secondValue)-1000)/1000, 0);
                                myArray.push(rowValue);
                            }
                            result.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            equalMatrixes = matrixEquality(iterationCount, false, equalMatrixes, result);
            if (equalMatrixes== true)
                LukasTransitiveClosure(firstStep, result);
            iterationCount++;
            while(equalMatrixes === false){
                matrixPower(firstStep, iterationCount, size, method, result);
                equalMatrixes = matrixEquality(iterationCount, limit, equalMatrixes, result);
                iterationCount++;
                if (equalMatrixes) {
                    LukasTransitiveClosure(firstStep, result);
                    break;
                    }
                else if (iterationCount > 50){
                    limit = true;
                }
            }
            return result
            break
        case METHOD_OF_CALCULATION.DRASTICKY_T_NORM:
            transitFlag = checkTransitivity(method, firstStep,result)
            if (transitFlag == false){
                result.resultMatrix = firstStep;
                return result;
            }

            else {
                const arr = createArrayOfArrays(firstStep.length);
                result.steps.push(arr);
                    for (let a = 0; a < firstStep.length; a++) {
                        for (let b = 0; b < firstStep[a].length; b++) {
                            for (let c = 0; c < firstStep[a].length; c++) {
                                rowValue = Math.max(firstStep[a][c], result.steps[0][c][b]) == 1 ? Math.min(firstStep[a][c], result.steps[0][c][b]) : 0;
                                myArray.push(rowValue);
                            }
                            result.steps[1][a][b] = Math.max.apply(Math, myArray);
                            while(myArray.length > 0) 
                                myArray.pop();
                        }
                    }
            }
            
            equalMatrixes = matrixEquality(iterationCount, false, equalMatrixes, result);
            if (equalMatrixes== true)
                DrastTransitiveClosure(firstStep, result);
                iterationCount++;
            while(equalMatrixes=== false){
                matrixPower(firstStep, iterationCount, size, method, result);
                equalMatrixes = matrixEquality(iterationCount, limit, equalMatrixes, result);
                iterationCount++;
                if (equalMatrixes) {
                    DrastTransitiveClosure(firstStep, result);
                    break;
                    }
            }
            return result
            break
    }
}

export default calculateMatrix