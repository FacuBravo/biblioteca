document.querySelector('#burger_btn').addEventListener('click', showMainMenu)

function showMainMenu() {
    document.querySelector('#nav').classList.toggle('navHide')
}

document.querySelector('#user_btn').addEventListener('click', showUserMenu)

function showUserMenu() {
    document.querySelector('#navUser').classList.toggle('navHide')
}