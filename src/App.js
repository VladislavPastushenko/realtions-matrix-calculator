import { useEffect, useState } from "react";
import "./App.css";
import Matrix from "./components/Matrix";
import calculateMatrix from "./utils/CalculateMatrix";
import PaginationMatrix from "./components/PaginationMatrix";

const SIZE_OPTIONS = [2, 3, 4, 5, 6]


function App() {
  const [size, setSize] = useState(3)
  const [valuesToCount, setValuesToCount] = useState ([[1, 0.5, 0.7],
                                                       [0.5, 0.5, 0.1],
                                                       [0.7, 0.1, 0.8]])
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
    console.log("start")
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

  useEffect(() => {
    setStepValues([])
    setResultValues([])
    setResult(false)
    setIsCalculated(false)
  }, [size])

  return (
    <div>
      <h1>
        Tranzitivní uzávěr
      </h1>
      <div className="select-container">
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
      </div>
      <div className="select-container">
        <label>
              Vyberte t-normu:
        </label>
        <select
          className="select"
        >
        <option value="en">Minimova</option>
        <option value="es">Soucinova</option>
        <option value="pt">Lukasiewiczova</option>
        <option value="pt">Drasticky soucin </option>
        </select>
      </div>

      <div>
        <Matrix size={size} values={valuesToCount} onChange={onChangeValueToCount} _key="initial"/>
      </div>
      <div style={{marginTop: "1em"}}>
        <button className="button" onClick={() => {startCalculation()}}>
          Spočítat
        </button>
      </div>
      {error && <div className="error-message"> Zadejte spravne hodnoty </div>}

      {isCalculated &&
      <div className="calculation-container">
        <h2> Kalkulace </h2>

        <p>Kroky:</p>
        <PaginationMatrix data={stepsValues} size={size}/>

        <p>Výsledek:</p>
        <div>
          <Matrix size={size} values={resultValues} _key="results"/>
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
