import "./Pagination.css"

function Pagination({currentPage, totalPages, onChangePage}) {
    return (
        <div className="pagination-buttons-container">
            <button
                className="pagination-button"
                disabled={currentPage === 0}
                onClick={() => {onChangePage(0)}}
            >
                ᐊᐊ
            </button>
            <button
                className="pagination-button"
                disabled={currentPage === 0}
                onClick={() => {onChangePage(currentPage - 1)}}
            >
                ᐊ
            </button>
            <button
                className="pagination-button"
                disabled={currentPage === totalPages - 1}
                onClick={() => {onChangePage(currentPage + 1)}}
            >
                ᐅ
            </button>
            <button
                className="pagination-button"
                disabled={currentPage === totalPages - 1}
                onClick={() => {onChangePage(totalPages - 1)}}
            >
                ᐅᐅ
            </button>
        </div>
    )
}

export default Pagination