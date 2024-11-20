let userLogged = localStorage.getItem("logged") ?? false
const logoutBtn = document.querySelector("#logout_btn")
const loginBtn = document.querySelector("#login_btn")

setLogged()

function setLogged() {
    if (userLogged) {
        if (logoutBtn.classList.contains("hidden")) {
            logoutBtn.classList.remove("hidden")
        }

        if (!loginBtn.classList.contains("hidden")) {
            loginBtn.classList.add("hidden")
        }

        logoutBtn.addEventListener('click', logout)
    } else {
        if (!logoutBtn.classList.contains("hidden")) {
            logoutBtn.classList.add("hidden")
        }

        if (loginBtn.classList.contains("hidden")) {
            loginBtn.classList.remove("hidden")
        }

        loginBtn.addEventListener('click', showLoginDialog)
    }
}

// LOGIN

const loginDialog = document.querySelector("#login_dialog")
let formLogin
document.querySelector("#close_login_dialog_btn").addEventListener('click', closeLoginDialog)

function showLoginDialog() {
    userNav.classList.add('navHide')
    loginDialog.showModal()
    formLogin = document.querySelector("#login_form")
    formLogin.addEventListener("submit", login)
}

function closeLoginDialog() {
    document.querySelector("#form_login_message").innerHTML = ""
    formLogin.reset()
    loginDialog.close()
}

function login(e) {
    e.preventDefault()
    const data = Object.fromEntries(
        new FormData(formLogin)
    )

    const username = data.username
    const pass = data.pass

    window.electronAPI.login((logged) => {
        if (logged) {
            userLogged = true
            setLogged()
            localStorage.setItem("logged", true)
            closeLoginDialog()
        } else {
            document.querySelector("#form_login_message").innerHTML = "Usuario y/o contraseña incorrectos"
        }

    }, username, pass)
}

// LOGOUT

function logout() {
    userLogged = false
    setLogged()
    localStorage.setItem("logged", false)
}

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