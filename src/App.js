import { useEffect, useState } from "react";
import "./App.css";
import Matrix from "./components/Matrix";
import calculateMatrix from "./utils/CalculateMatrix";
import PaginationMatrix from "./components/PaginationMatrix";
import { METHOD_OF_CALCULATION } from "./utils/CalculateMatrix";

const SIZE_OPTIONS = [2, 3, 4, 5, 6]
const TIP_TEXT = {
  [METHOD_OF_CALCULATION.MIN_T_NORM]: `MIN_T_NORM Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
  molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
  numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
  optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
  obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
  nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
  tenetur error, harum nesciunt ipsum debitis quas aliquid.`,
  [METHOD_OF_CALCULATION.MULTIPLYING_T_NORM]: `Multiplying Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
  molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
  numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
  optio, eaque rerum!`,
  [METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM]: `Luka Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
  molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
  numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
  optio, eaque rerum! Provident similique accusantium nemo autem.`,
  [METHOD_OF_CALCULATION.DRASTICKY_T_NORM]: `Drastick Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
  molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
  numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
  optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
  obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
  nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
  tenetur error, harum nesciunt ipsum debitis quas aliquid.`,
}

function App() {
  const [size, setSize] = useState(3)
  const [valuesToCount, setValuesToCount] = useState ([[1, 0.5, 0.7],
                                                       [0.5, 0.5, 0.1],
                                                       [0.7, 0.1, 0.8]])
  const [methodOfCalculation, setMethodOfCalculation] = useState(METHOD_OF_CALCULATION.MIN_T_NORM)
  const [stepsValues, setStepValues] = useState([])
  const [resultValues, setResultValues] = useState([])
  const [result, setResult] = useState(false)
  const [isCalculated, setIsCalculated] = useState(false)
  const [error, setError] = useState(false)

  const changeSize = (newSize) => {
    setStepValues([])
    setResultValues([])
    setResult(false)
    setIsCalculated(false)

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

    const resultData = calculateMatrix(valuesToCount, methodOfCalculation)

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
          onChange={e => {setMethodOfCalculation(e.currentTarget.value)}}
          value={methodOfCalculation}
        >
        <option value={METHOD_OF_CALCULATION.MIN_T_NORM}>Minimova</option>
        <option value={METHOD_OF_CALCULATION.MULTIPLYING_T_NORM}>Soucinova</option>
        <option value={METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM}>Lukasiewiczova</option>
        <option value={METHOD_OF_CALCULATION.DRASTICKY_T_NORM}>Drasticky soucin </option>
        </select>
        <p className="method-of-calculation-tip-text">
          {TIP_TEXT[methodOfCalculation]}
        </p>
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
