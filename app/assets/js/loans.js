const chargeBookInfo = document.querySelector("#info_book")
const chargeUserInfo = document.querySelector("#info_user")
let loanInfo = null
getSession()

function getSession() {
    window.session.getSession().then((data) => {
        if (data != {}) {
            token = data.token
        } else {
            token = null
        }

        setLogged()
        checkLogged()
    })
}

function checkLogged() {
    if (token != null) {
        getData()
    } else {
        loanInfo = null
        printInfo()
    }

    getLoans()
}

let loans = []

const searcherInput = document.querySelector('#searcher_input')
searcherInput.addEventListener('keyup', filter)

function getLoans() {
    window.loansAPI.getLoans((loansData) => {
        loans = loansData
        showLoans()
    })
}

function showLoans() {
    const loansTable = document.querySelector("#table_body")
    loansTable.innerHTML = ''
    
    for (const loan of loans) {
        loansTable.innerHTML += `
            <tr class="search_item ${loan.date_end < getCurrentDate() && loan.returned == 0 ? 'late' : ''}">
                <td>${formatDate(loan.date_start)}</td>
                <td>${formatDate(loan.date_end)}</td>
                <td>"${loan.title}" - #${loan.book_id}</td>
                <td>${loan.name} - #${loan.partner_id}</td>
                <td class="actions">
                    <button id="btn_return_book_${loan.book_id}_${loan.id}" class="btn_return_book ${loan.returned == 1 ? 'hidden' : ''}">
                        Devolver
                    </button>
                </td>
            </tr>
        `
    }

    document.querySelectorAll('.btn_return_book').forEach(e => e.addEventListener('click', returnBook))
}

function returnBook(e) {
    const arr = e.target.id.split('_')
    const id = arr[4]
    const bookId = arr[3]
    window.booksAPI.updateBookState((res) => {
        window.loansAPI.updateLoanState((res) => {
            getLoans()
        }, id, 1, token)
    }, bookId, 0, token)
}

function filter() {
    const search = searcherInput.value.toLowerCase()

    document.querySelectorAll(".search_item").forEach(item => {
        if (item.textContent.toLowerCase().includes(search)) {
            item.classList.remove("hidden_search_item")
        } else {
            item.classList.add("hidden_search_item")
        }
    })
}

function getData() {
    window.loansAPI.getLoanData((loanData) => {
        loanInfo = loanData
        printInfo()
    }, token)
}

function printInfo() {
    chargeBookInfo.innerHTML = ''
    chargeUserInfo.innerHTML = ''

    if (loanInfo == null) {
        return
    }

    if (loanInfo.book.id) {
        chargeBookInfo.innerHTML += loanInfo.book.title
    }

    if (loanInfo.user.id) {
        chargeUserInfo.innerHTML += loanInfo.user.name
    }
}

document.querySelector("#btn_lend_book").addEventListener("click", showLoanDialog)
let formLoan

function showLoanDialog() {
    if (loanInfo != null) {
        if (loanInfo.book.id && loanInfo.user.id) {
            document.querySelector("#loan_dialog").showModal()
            formLoan = document.querySelector("#form_close_loan")
            formLoan.addEventListener("submit", setLoan)
        }
    }
}

document.querySelector("#close_loan_dialog_btn").addEventListener("click", closeLoanDialog)

function closeLoanDialog() {
    document.querySelector("#loan_animation").style.top = "100%"
    document.querySelector("#loan_book").style.animation = ""
    document.querySelector("#loan_dialog").style.minWidth = "100px"
    document.querySelector("#loan_dialog").style.minHeight = "100px"
    document.querySelector("#loan_dialog").close()
}

function setLoan(e) {
    e.preventDefault()

    const data = Object.fromEntries(
        new FormData(formLoan)
    )

    const date_end = data.date_end
    const date_start = getCurrentDate()

    const loanData = {
        date_end,
        date_start,
        book_id: loanInfo.book.id,
        partner_id: loanInfo.user.id
    }

    document.querySelector("#loan_animation").style.top = "0"
    document.querySelector("#loan_book").style.animation = "loanBookAnimation 1s .5s ease-in-out both"
    document.querySelector("#loan_dialog").style.minWidth = "400px"
    document.querySelector("#loan_dialog").style.minHeight = "300px"

    window.loansAPI.addLoan((loan) => {
        window.booksAPI.updateBookState((res) => {
            loanInfo = null
            getLoans()
        }, loanInfo.book.id, 1, token)

    }, loanData, token)
}

function getCurrentDate() {
    const fecha = new Date()
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
}

function formatDate(date) {
    let arr = date.split('-')
    return arr[2] + '/' + arr[1] + '/' + arr[0]
}