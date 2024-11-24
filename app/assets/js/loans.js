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
        console.log(loan)
    }, loanData, token)
}

function getCurrentDate() {
    const fecha = new Date()
    const anio = fecha.getFullYear()
    const mes = String(fecha.getMonth() + 1).padStart(2, '0')
    const dia = String(fecha.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}`
}