// GET STATS

getNPartners()
getNBooks()
getNLoans()

function getNPartners() {
    window.data.getUsersN((partners) => {
        document.querySelector("#charged_users_n").innerHTML = partners
    })
}

function getNBooks() {
    window.data.getBooksN((books) => {
        document.querySelector("#charged_books_n").innerHTML = books
    })
}

function getNLoans() {
    window.data.getLoansN((loans) => {
        document.querySelector("#active_loans_n").innerHTML = loans
    })
}

getSession()

function getSession() {
    window.session.getSession().then((data) => {
        if (data != {}) {
            token = data.token
        } else {
            token = null
        }

        setLogged()
    })
}