import { useState } from "react"
import Matrix from "./Matrix"
import Pagination from "./Pagination"
import "./PaginationMatrix.css"

function PaginationMatrix({data, size}) {
    const [step, setStep] = useState(0)
    return (
        <div className="pagination-matrix-container">
            <div className="steps-container">
                {data.slice(step * 2, step * 2 + 2).map((stepMatrix, idx) => (
                    <div key={"step" + idx} className="step-container">
                        <PaginationMatrixArrow hide={step === 0 || idx === 1}/>
                        <div>
                            <div className="step-header">Krok: {step * 2 + idx} </div>
                            <Matrix size={size} values={stepMatrix} degree={step * 2 + idx} _key="step"/>
                        </div>
                        <PaginationMatrixArrow
                            hide={
                                (step === (Math.ceil(data.length / 2) - 1) && idx === 1) ||
                                (step === (Math.ceil(data.length / 2) - 1) && data.length % 2 === 1)
                                }
                        />
                    </div>
                ))}
            </div>
            <Pagination
                currentPage={step}
                totalPages={Math.ceil(data.length / 2)}
                onChangePage={setStep}
            />
        </div>
    )
}

function PaginationMatrixArrow({hide}) {
    if (!hide) {
        return (
            <div className="pagination-matrix-arrow">
                ⟶
            </div>
        )
    }
}

export default PaginationMatrix