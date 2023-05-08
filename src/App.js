import { useEffect, useState } from "react";
import "./App.css";
import Matrix from "./components/Matrix";
import calculateMatrix from "./utils/CalculateMatrix";

const SIZE_OPTIONS = [2, 3, 4, 5, 6]


function App() {
  const [size, setSize] = useState(2)
  const [valuesToCount, setValuesToCount] = useState([[0.2, 0.2], [0.2, 0.2]])
  const [stepsValues, setStepValues] = useState([])
  const [resultValues, setResultValues] = useState([])
  const [result, setResult] = useState(false)
  const [isCalculated, setIsCalculated] = useState(false)
  const [error, setError] = useState(false)

  const changeSize = (newSize) => {
    newSize = parseInt(newSize)

    const tmp = [...valuesToCount]
    if (size < newSize) {
      for (let i = 0; i < newSize - size; i++) {
        tmp.forEach(element => {element.push(0)});
      }

      for (let i = 0; i < newSize - size; i++) {
        tmp.push(new Array(newSize).fill(0))
      }
    } else {
      for (let i = 0; i < size - newSize; i++) {
        tmp.forEach(element => {element.pop()});
        tmp.pop()
      }
    }

    setValuesToCount(tmp)
    setSize(newSize)
  }

  const onChangeValueToCount = (value, rowNumber, colNumber) => {
    setError(false)
    const tmp = [...valuesToCount]
    tmp[rowNumber][colNumber] = value
    setValuesToCount(tmp)
  }

  const startCalculation = () => {
    setError(false)
    const errorFlag = valuesToCount.find((row =>
      -1 !== row.findIndex(col => col > 1 || col < 0 || col === "")
    ))

    if (errorFlag) {
      setError(true)
      return
    }

    const resultData = calculateMatrix(valuesToCount)

    setStepValues(resultData.steps)
    setResultValues(resultData.resultMatrix)
    setResult(resultData.result)
    setIsCalculated(true)
  }

  return (
    <div>
      <h1>
        Tranzitivní uzávěr
      </h1>
      <div>
        <p className="label">
          <label>
            Zadejte velikost relace:
          </label>
          <select
            className="select"
            onChange={e => {changeSize(e.currentTarget.value)}}
            value={size}
          >
            {SIZE_OPTIONS.map(el => (
              <option value={el} key={"sizeOption" + el}> {el}x{el} </option>
            ))}
          </select>
        </p>
      </div>

      <div>
        <Matrix size={size} values={valuesToCount} onChange={onChangeValueToCount}/>
      </div>
      <div style={{marginTop: "1em"}}>
        <button className="button" onClick={startCalculation}>
          Spočítat
        </button>
      </div>
      {error && <div className="error-message"> Zadejte spravne hodntoy </div>}

      {isCalculated &&
      <div className="calculation-container">
        <h2> Kalkulace </h2>

        <p>Kroky:</p>
        <div className="steps-container">
          {stepsValues.map((stepMatrix, idx) => (
            <div key={"step" + idx}>
              <div className="step-header">Krok: {idx}</div>
              <Matrix size={size} values={stepMatrix} degree={idx}/>
            </div>
          ))}
        </div>
        <p>Výsledek:</p>
          <div>
            <Matrix size={size} values={resultValues}/>
          </div>

        <p> Tranzitivní uzávěr:
          {result
          ? <span style={{fontWeight: "600", color: "green"}}> Ano </span>
          : <span style={{fontWeight: "600", color: "red"}}> Ne </span>
          }
        </p>
      </div>
      }
    </div>
  );
}

export default App;
