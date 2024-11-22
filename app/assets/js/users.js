const addUserBtn = document.querySelector('#btn_add_user')
addUserBtn.addEventListener('click', showAddUserDialog)

let users = []

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
    if (token == null) {
        addUserBtn.classList.add("hidden")
    } else {
        addUserBtn.classList.remove("hidden")
    }

    getUsers()
}

const searcherInput = document.querySelector('#searcher_input')
searcherInput.addEventListener('keyup', filter)

const dialogAddUser = document.querySelector("#add_user_dialog")

function getUsers() {
    window.usersAPI.getUsers((usersData) => {
        users = usersData
        showUsers()
    })
}

function showUsers() {
    const usersTable = document.querySelector("#table_body")
    usersTable.innerHTML = ''

    for (const user of users) {
        usersTable.innerHTML += `
            <tr class="search_item">
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.surname}</td>
                <td>${user.type}</td>
                <td class="actions">
                    <button class="btn_user_info">
                        <img id="btn_user_info_${user.id}" src="assets/images/icons/Info.svg" alt="See more">
                    </button>
                    <button class="btn_delete_user ${token == null ? 'hidden' : ''}">
                        <img id="btn_delete_user_${user.id}" src="assets/images/icons/Trash.svg" alt="Delete">
                    </button>
                </td>
            </tr>
        `
    }

    document.querySelectorAll('.btn_delete_user').forEach(e => e.addEventListener('click', showDialogDelete))
    document.querySelectorAll('.btn_user_info').forEach(e => e.addEventListener('click', showDialogInfo))
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

let formAddUser

function showAddUserDialog() {
    dialogAddUser.showModal()
    document.querySelector('#close_add_user_dialog_btn').addEventListener('click', closeAddUserDialog)
    formAddUser = document.querySelector("#add_user_form")
    formAddUser.addEventListener("submit", addUser)
}

function closeAddUserDialog() {
    document.querySelector("#form_add_user_message").innerHTML = ""
    formAddUser.reset()
    dialogAddUser.close()
}

function addUser(e) {
    e.preventDefault()
    const data = Object.fromEntries(
        new FormData(formAddUser)
    )
    const name = data.name
    const surname = data.surname
    const grade = data.grade
    const section = data.section
    const type = data.type

    const userInfo = {
        name,
        surname,
        grade,
        section,
        type
    }

    window.usersAPI.addUser((user) => {
        users.push(user)
        showUsers()
        closeAddUserDialog()
    }, userInfo, token)
}

let idToDelete = -1

function showDialogDelete(e) {
    idToDelete = e.target.id.split('_')[3]
    document.querySelector("#delete_user_dialog").showModal()
    document.querySelector("#close_delete_user_dialog_btn").addEventListener("click", closeDeleteDialog)
    document.querySelector("#close_delete_user_dialog_btn").addEventListener("click", closeDeleteDialog)
    document.querySelector("#sure_delete_user").addEventListener("click", deleteUser)
}

function closeDeleteDialog() {
    idToDelete = -1
    document.querySelector("#delete_user_dialog").close()
}

function deleteUser() {
    window.usersAPI.deleteUser((user) => {
        if (user) {
            const index = users.findIndex(o => o.id === user.id)

            if (index > -1) {
                closeDeleteDialog()
                users.splice(index, 1)
                showUsers()
            }
        }
    }, idToDelete, token)
}

const dialogInfo = document.querySelector("#user_info_dialog")

function showDialogInfo(e) {
    const id = e.target.id.split('_')[3]
    const index = users.findIndex(o => o.id == id)

    if (index > -1) {
        const user = users[index]
        dialogInfo.showModal()
        document.querySelector("#close_info_user_dialog_btn").addEventListener("click", closeInfoDialog)

        dialogInfo.querySelector("#user_info_content").innerHTML = ''

        dialogInfo.querySelector("#user_info_content").innerHTML += `
            <p>${user.surname}, ${user.name}</p>
            <p>${user.grade} "${user.section}"</p>
            <p>${user.type}</p>
        `

        if (token == null) {
            document.querySelector("#edit_user_btn").classList.add("hidden")
        } else {
            document.querySelector("#edit_user_btn").classList.remove("hidden")
            document.querySelector("#edit_user_btn").addEventListener("click", () => editUser(index))
        }
    }
}

function closeInfoDialog() {
    document.querySelector("#edit_user_btn").classList.remove("hidden")
    dialogInfo.close()
}

let formEditUser

function editUser(index) {
    const user = users[index]
    dialogInfo.querySelector("#user_info_content").innerHTML = ''

    dialogInfo.querySelector("#user_info_content").innerHTML += `
        <form id="edit_user_form">
            <button class="send_form_edit_user">
                <img src="assets/images/icons/Tick.svg" alt="Tick">
            </button>

            <div>
                <input name="surname" class="secondary_input" type="text" value="${user.surname}" placeholder="Apellido" required>
                <input name="name" class="secondary_input" type="text" value="${user.name}" placeholder="Nombre" required>
            </div>

            <div>
                <input name="grade" class="secondary_input" type="text" value="${user.grade}" placeholder="Grado" required> 
                <input name="section" class="secondary_input" type="text" value="${user.section}" placeholder="Sección" required>
            </div>

            <input name="type" class="secondary_input" type="text" value="${user.type}" placeholder="Tipo" required>
        </form>
    `
    document.querySelector("#edit_user_btn").classList.add("hidden")
    formEditUser = document.querySelector("#edit_user_form")
    formEditUser.addEventListener("submit", (e) => updateUser(e, index))
}

function updateUser(e, index) {
    e.preventDefault()
    const id = users[index].id

    const data = Object.fromEntries(
        new FormData(formEditUser)
    )
    const name = data.name
    const surname = data.surname
    const grade = data.grade
    const section = data.section
    const type = data.type

    const userInfo = {
        id,
        name,
        surname,
        grade,
        section,
        type
    }

    closeInfoDialog()

    window.usersAPI.updateUser((res) => {
        if (res != null) {
            users[index] = userInfo
            showUsers()
        }
    }, userInfo, token)
}