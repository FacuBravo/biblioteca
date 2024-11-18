// SHOW AND HIDE MENUS

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

// GET STATS

// getNPartners()
// getNBooks()
// getNLoans()

// function getNPartners() {
//     window.electronAPI.getUsersN((partners) => {
//         document.querySelector("#charged_users_n").innerHTML = partners
//     })
// }

// function getNBooks() {
//     window.electronAPI.getBooksN((books) => {
//         document.querySelector("#charged_books_n").innerHTML = books
//     })
// }

// function getNLoans() {
//     window.electronAPI.getLoansN((loans) => {
//         document.querySelector("#active_loans_n").innerHTML = loans
//     })
// }

// LOGIN

const loginDialog = document.querySelector("#login_dialog")
let formLogin
document.querySelector("#login_btn").addEventListener('click', showLoginDialog)
document.querySelector("#close_login_dialog_btn").addEventListener('click', closeLoginDialog)

function showLoginDialog() {
    userNav.classList.add('navHide')
    loginDialog.showModal()
    formLogin = document.querySelector("#login_form")
    formLogin.addEventListener("submit", login)
}

function closeLoginDialog() {
    loginDialog.close()
}

function login(e) {
    e.preventDefault()
    // window.electronAPI.login((logged) => {
    //     console.log(logged)
    // }, 'biblio56', 'storni')
}