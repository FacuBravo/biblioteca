const searcherInput = document.querySelector('#searcher_input')
searcherInput.addEventListener('keyup', filter)
let books = []

checkLogged()

function checkLogged() {
    if (userLogged == false) {
        window.location.href = "home.html"
    } else {
        getBooks()
    }
}

function getBooks() {
    window.electronAPI.getBooks((booksData) => {
        books = booksData
        console.log(books)
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
                    <button id="btn_book_info_${book.id}">
                        <img src="assets/images/icons/Info.svg" alt="See more">
                    </button>
                    <button id="btn_delete_book_${book.id}">
                        <img src="assets/images/icons/Trash.svg" alt="Delete">
                    </button>
                </td>
            </tr>
        `
    }
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

document.querySelector('#btn_add_book').addEventListener('click', showAddBookDialog)
const dialogAddBook = document.querySelector("#add_book_dialog")
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
    const edition = data.edition
    const place = data.place
    const editorial = data.editorial
    const date = data.date
    const theme = data.theme
    const colection = data.colection

    const bookInfo = {
        title,
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
    }, bookInfo)
}