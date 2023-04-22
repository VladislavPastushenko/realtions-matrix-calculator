import "./Matrix.js";
import "./Matrix.css"

const LETTERS = ["a", "b", "c", "d", "e", "f"]

function Matrix({size, values, onChange=(() => {})}) {

  const ths = []
  for (let i = 0; i < size; i++) {
    ths.push(<th key={"th" + i} className="cell">{LETTERS[i]}</th>)
  }


  return (
    <div>
        <table>
            <thead>
                <tr>
                <th></th>
                {ths}
                </tr>
            </thead>
            <tbody>
                {values.map((row, rowNumber) => (
                    <tr key={"row" + rowNumber}>
                        <th className="cell">{LETTERS[rowNumber]}</th>
                        {row.map((el, columnNumber) => {
                            const errorFlagClass = el > 1 || el < 0
                            ? " error-cell"
                            : ""
                            return (
                                <td
                                    key={"col" + rowNumber + " " + columnNumber}
                                    className={"cell"}
                                >
                                    <input
                                        className={"input-cell" + errorFlagClass}
                                        type="number"
                                        value={el}
                                        onChange={(e) => {onChange(e.currentTarget.value, rowNumber, columnNumber)}}
                                        step={0.1}
                                        max={1}
                                        min={0}
                                    />
                                </td>
                            )}
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  );
}

export default Matrix;