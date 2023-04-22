// Example of result
const mockResult = {
    steps: [
        [[0.2, 0.2], [0.2, 0.2]],
        [[0.2, 0.2], [0.2, 0.2]],
        [[0.2, 0.2], [0.2, 0.2]],
        [[0.2, 0.2], [0.2, 0.2]],
      ],
    resultMatrix: [[0.5, 0.5], [0.5, 0.5]],
    result: true,
  }

export const METHOD_OF_CALCULATION = {
    MIN_T_NORM: "MIN_T_NORM",
    MULTIPLYING_T_NORM: "MULTIPLYING_T_NORM",
    LUKASIEWICZ_T_NORM: "LUKASIEWICZ_T_NORM",
    DRASTICKY_T_NORM: "DRASTICKY_T_NORM",
}


// VIKA TODO:
/**
 *
 * @param {Array.Number[]} firstStep - First step matrix, for example [[0.2, 0.2], [0.2, 0.2]]
 * @param {String} method - Method of calculation
 * @param {Number} iterationsLimit - Max number of iterations
 * @returns {Object}
 */
function calculateMatrix(firstStep, method=METHOD_OF_CALCULATION.MIN_T_NORM, iterationsLimit = 15) {
    switch(method) {
        case METHOD_OF_CALCULATION.MIN_T_NORM:
            return mockResult
            break
        case METHOD_OF_CALCULATION.MULTIPLYING_T_NORM:
            return mockResult
            break
        case METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM:
            return mockResult
            break
        case METHOD_OF_CALCULATION.DRASTICKY_T_NORM:
            return mockResult
            break
    }
}

export default calculateMatrix