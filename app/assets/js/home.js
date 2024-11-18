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

getUsers()

function getUsers() {
    window.electronAPI.getUsers((users) => {
        console.log(users)
    })
}