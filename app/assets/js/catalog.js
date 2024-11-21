const searcherInput = document.querySelector('#searcher_input')
searcherInput.addEventListener('keyup', filter)

const addBookBtn = document.querySelector('#btn_add_book')
addBookBtn.addEventListener('click', showAddBookDialog)

const dialogAddBook = document.querySelector("#add_book_dialog")

let books = []
let sortedBy = 'id_asc'

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
        addBookBtn.classList.add("hidden")
    } else {
        addBookBtn.classList.remove("hidden")
    }

    getBooks()
}

function getBooks() {
    window.electronAPI.getBooks((booksData) => {
        books = booksData
        showBooks()
    })
}

function showBooks() {
    const booksTable = document.querySelector("#table_body")
    booksTable.innerHTML = ''

    for (const book of books) {
        booksTable.innerHTML += `
            <tr class="search_item">
                <td>${book.id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.theme}</td>
                <td class="actions">
                    <button class="btn_book_info">
                        <img id="btn_book_info_${book.id}" src="assets/images/icons/Info.svg" alt="See more">
                    </button>
                    <button class="btn_delete_book ${token == null ? 'hidden' : ''}">
                        <img id="btn_delete_book_${book.id}" src="assets/images/icons/Trash.svg" alt="Delete">
                    </button>
                </td>
            </tr>
        `
    }

    document.querySelectorAll('.btn_delete_book').forEach(e => e.addEventListener('click', showDialogDelete))
    document.querySelectorAll('.btn_book_info').forEach(e => e.addEventListener('click', showDialogInfo))
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

let formAddBook

function showAddBookDialog() {
    dialogAddBook.showModal()
    document.querySelector('#close_add_book_dialog_btn').addEventListener('click', closeAddBookDialog)
    formAddBook = document.querySelector("#add_book_form")
    formAddBook.addEventListener("submit", addBook)
}

function closeAddBookDialog() {
    document.querySelector("#form_add_book_message").innerHTML = ""
    formAddBook.reset()
    dialogAddBook.close()
}

function addBook(e) {
    e.preventDefault()
    const data = Object.fromEntries(
        new FormData(formAddBook)
    )
    const title = data.title
    const author = data.author
    const edition = data.edition
    const place = data.place
    const editorial = data.editorial
    const date = data.date
    const theme = data.theme
    const colection = data.colection

    const bookInfo = {
        title,
        author,
        edition,
        place,
        editorial,
        date,
        theme,
        colection
    }

    window.electronAPI.addBook((book) => {
        books.push(book)
        showBooks()
        closeAddBookDialog()
    }, bookInfo, token)
}

document.querySelectorAll(".sortable").forEach(e => {
    e.addEventListener('click', sort)
})

function sort(e) {
    document.querySelectorAll('.sort_img').forEach(e => {
        if (!e.classList.contains('hidden')) {
            e.classList.add('hidden')
        }
    })

    let sortBy = e.target.id
    sortBy = sortBy.split('_')
    let categoryImg

    if (sortBy.length == 4) {
        sortBy = sortBy[3]
        categoryImg = document.querySelector('#' + e.target.id)
    } else {
        sortBy = sortBy[2]
        categoryImg = document.querySelector('#arrow_' + e.target.id)
    }

    categoryImg.classList.remove('hidden')

    switch (sortBy) {
        case 'n':
            if (sortedBy == "id_asc") {
                books.sort((a, b) => {
                    return b.id - a.id
                })

                categoryImg.style.transform = 'rotate(180deg)'
                sortedBy = "id_desc"
            } else {
                books.sort((a, b) => {
                    return a.id - b.id
                })

                categoryImg.style.transform = 'rotate(0deg)'
                sortedBy = "id_asc"
            }
            break;
        case 'title':
            if (sortedBy == "title_asc") {
                books.sort((a, b) => {
                    if (a.title.toLowerCase() > b.title.toLowerCase()) {
                        return -1
                    } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(180deg)'
                sortedBy = "title_desc"
            } else {
                books.sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return -1
                    } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(0deg)'
                sortedBy = "title_asc"
            }
            break;
        case 'author':
            if (sortedBy == "author_asc") {
                books.sort((a, b) => {
                    if (a.author.toLowerCase() > b.author.toLowerCase()) {
                        return -1
                    } else if (a.author.toLowerCase() < b.author.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(180deg)'
                sortedBy = "author_desc"
            } else {
                books.sort((a, b) => {
                    if (a.author.toLowerCase() < b.author.toLowerCase()) {
                        return -1
                    } else if (a.author.toLowerCase() > b.author.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(0deg)'
                sortedBy = "author_asc"
            }
            break;
        case 'theme':
            if (sortedBy == "theme_asc") {
                books.sort((a, b) => {
                    if (a.theme.toLowerCase() > b.theme.toLowerCase()) {
                        return -1
                    } else if (a.theme.toLowerCase() < b.theme.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(180deg)'

                sortedBy = "theme_desc"
            } else {
                books.sort((a, b) => {
                    if (a.theme.toLowerCase() < b.theme.toLowerCase()) {
                        return -1
                    } else if (a.theme.toLowerCase() > b.theme.toLowerCase()) {
                        return 1
                    } else {
                        return 0
                    }
                })

                categoryImg.style.transform = 'rotate(0deg)'

                sortedBy = "theme_asc"
            }
            break;
        default:
            return
            break;
    }

    showBooks()
    filter()
}

let idToDelete = -1

function showDialogDelete(e) {
    idToDelete = e.target.id.split('_')[3]
    document.querySelector("#delete_book_dialog").showModal()
    document.querySelector("#close_delete_book_dialog_btn").addEventListener("click", closeDeleteDialog)
    document.querySelector("#close_delete_book_dialog_btn").addEventListener("click", closeDeleteDialog)
    document.querySelector("#sure_delete_book").addEventListener("click", deleteBook)
}

function closeDeleteDialog() {
    idToDelete = -1
    document.querySelector("#delete_book_dialog").close()
}

function deleteBook() {
    window.electronAPI.deleteBook((book) => {
        if (book) {
            const index = books.findIndex(o => o.id === book.id)

            if (index > -1) {
                closeDeleteDialog()
                books.splice(index, 1)
                showBooks()
            }
        }
    }, idToDelete, token)
}

const dialogInfo = document.querySelector("#book_info_dialog")

function showDialogInfo(e) {
    const id = e.target.id.split('_')[3]
    const index = books.findIndex(o => o.id == id)
    
    if (index > -1) {
        const book = books[index]
        dialogInfo.showModal()
        document.querySelector("#close_info_book_dialog_btn").addEventListener("click", closeInfoDialog)

        dialogInfo.querySelector("#book_info_content").innerHTML = ''
        dialogInfo.querySelector("#book_info_content").innerHTML += `
            <p>Número de inventario: ${book.id}</p>
            <p>Título: ${book.title}</p>
            <p>Autor: ${book.author}</p>
            <p>Tema: ${book.theme}</p>
            <p>Colección: ${book.colection}</p>
            <p>Editorial: ${book.editorial}</p>
            <p>Edición: ${book.edition}</p>
            <p>Fecha: ${book.date}</p>
            <p>Lugar: ${book.place}</p>
        `
    }
}

function closeInfoDialog() {
    dialogInfo.close()
}