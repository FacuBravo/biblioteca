const mainNav = document.querySelector('#nav')
const userNav = document.querySelector('#navUser')

document.querySelector('#burger_btn').addEventListener('click', showMainMenu)

function showMainMenu() {
    mainNav.classList.toggle('navHide')
    if (!userNav.classList.contains('navHide')) {
        userNav.classList.add('navHide')
    }
}

document.querySelector('#user_btn').addEventListener('click', showUserMenu)

function showUserMenu() {
    userNav.classList.toggle('navHide')
    if (!mainNav.classList.contains('navHide')) {
        mainNav.classList.add('navHide')
    }
}

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