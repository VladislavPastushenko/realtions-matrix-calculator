import { useEffect, useState } from 'react';
import './App.css';
import Matrix from './components/Matrix';

function App() {
  const [size, setSize] = useState(2)
  const [valuesToCount, setValuesToCount] = useState([[0.2, 0.2], [0.2, 0.2]])

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
    const tmp = [...valuesToCount]
    tmp[rowNumber][colNumber] = value
    setValuesToCount(tmp)
  }

  return (
    <div>
      <h1>
        Tranzitivní uzávěr
      </h1>
      <div>
        <p className='label'>
          <label>
            Zadejte velikost relace:
          </label>
          <select
            className='select'
            onChange={e => {changeSize(e.currentTarget.value)}}
            value={size}
          >
            <option value={2}>2x2</option>
            <option value={3}>3x3</option>
            <option value={4}>4x4</option>
            <option value={5}>5x5</option>
            <option value={6}>6x6</option>
          </select>
        </p>
      </div>

      <div>
        <Matrix size={size} values={valuesToCount} onChange={onChangeValueToCount}/>
      </div>
      <div style={{marginTop: '1em'}}>
        <button className='button'>
          Spočítat
        </button>
      </div>
    </div>
  );
}

export default App;
