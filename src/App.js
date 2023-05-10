import { useEffect, useState } from "react";
import "./App.css";
import Matrix from "./components/Matrix";
import calculateMatrix from "./utils/CalculateMatrix";
import PaginationMatrix from "./components/PaginationMatrix";
import { METHOD_OF_CALCULATION } from "./utils/CalculateMatrix";
import Footer from "./components/Footer";

const SIZE_OPTIONS = [2, 3, 4, 5, 6]
const TIP_TEXT = {
  [METHOD_OF_CALCULATION.MIN_T_NORM]: `Minimová t-norma je největší traingulární norma, je definována jako minimální hodnota
  funkce příslušnosti : T_M(x,y) = min(x,y).
  Pro tranzitivní uzávěr fuzzy množin používáme maximovou s-normu : S_M(x,y) = max(x,y).`,
  [METHOD_OF_CALCULATION.MULTIPLYING_T_NORM]: `Součinová t-norma T_P(x,y) je definována jako součin funkcí příslušnosti prvků x a y : T_P(x,y) = x * y.
  Pro tranzitivní uzávěr fuzzy množin používáme s-normu : S_P(x,y) = x + y - x * y. `,
  [METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM]: `Lukasiewiczova t-norma T_L(x,y) je definována následovně : T_L(x,y) = max(0, x + y -1).
  Pro tranzitivní uzávěr fuzzy množin používáme s-normu : S_L(x,y) = min(1, x + y). `,
  [METHOD_OF_CALCULATION.DRASTICKY_T_NORM]: `Drastický součin T_D(x,y) je definován následovně : T_D(x,y) = min(x, y), pokud max(x, y) = 1. Jinak T_D = 0.
  Pro tranzitivní uzávěr fuzzy množin používáme drastický součet : S_D(x,y) = max(x, y), jestli min(x, y) = 0. Jinak S_D = 1.`,
}

function App() {
  const [size, setSize] = useState(3)
  const [valuesToCount, setValuesToCount] = useState ([[0, 0, 0],
                                                       [0, 0, 0],
                                                       [0, 0, 0]])
  const [methodOfCalculation, setMethodOfCalculation] = useState(METHOD_OF_CALCULATION.MIN_T_NORM)
  const [stepsValues, setStepValues] = useState([])
  const [resultValues, setResultValues] = useState([])
  const [isCalculated, setIsCalculated] = useState(false)
  const [error, setError] = useState(false)

  const changeSize = (newSize) => {
    setStepValues([])
    setResultValues([])
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
    setIsCalculated(true)
  }

  return (
    <div className="content-container">
      <h1>
        Tranzitivní uzávěr
      </h1>
      <p className="description">Doplnění netranzitivní relace do tranzitivní se provádí
na základě operace tranzitivního uzávěru.
T-tranzitivní uzávěr fuzzy relace R je nejmenší relace, která obsahuje R a je T-tranzitivní.

Tranzitivní uzávěr dostaneme následovně:
R<sub>T</sub><sup>+</sup> = R &cup; R<sup>2</sup> &cup; R<sup>3</sup> &cup; R<sup>4</sup> &cup; ... R<sup>n</sup>,
kde je R<sup>2</sup> = R &bull;<sub>T</sub> R, R<sup>3</sup> = R &bull;<sub>T</sub> R &bull;<sub>T</sub> R atd. Při určování tranzitivního uzávěru se stupeň  R<sup>n</sup> počítá do doby, než je
n nalezen takový, že R<sup>n</sup> = R<sup>n+1</sup>. Vzhledem k tomu, že při skládání relací aplikujeme nějakou t-normu,  při konstrukci R<sub>T</sub><sup>+</sup>  použijeme její duální s-normu pro určení sjednocení.
      </p>
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
          title={TIP_TEXT[methodOfCalculation]}
        >
        <option value={METHOD_OF_CALCULATION.MIN_T_NORM}>Minimová</option>
        <option value={METHOD_OF_CALCULATION.MULTIPLYING_T_NORM}>Součinová</option>
        <option value={METHOD_OF_CALCULATION.LUKASIEWICZ_T_NORM}>Lukasiewiczova</option>
        <option value={METHOD_OF_CALCULATION.DRASTICKY_T_NORM}>Drastický součin </option>
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
        <h2> Výpočet tranzitivního uzávěru </h2>

        <p>Kroky:</p>
        <PaginationMatrix data={stepsValues} size={size}/>

        <p>Výsledek:</p>
        <div>
          <Matrix size={size} values={resultValues} _key="results"/>
        </div>
      </div>
      }
      <Footer/>
    </div>
  );
}

export default App;
