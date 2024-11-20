// GET STATS

getNPartners()
getNBooks()
getNLoans()

function getNPartners() {
    window.electronAPI.getUsersN((partners) => {
        document.querySelector("#charged_users_n").innerHTML = partners
    })
}

function getNBooks() {
    window.electronAPI.getBooksN((books) => {
        document.querySelector("#charged_books_n").innerHTML = books
    })
}

function getNLoans() {
    window.electronAPI.getLoansN((loans) => {
        document.querySelector("#active_loans_n").innerHTML = loans
    })
}