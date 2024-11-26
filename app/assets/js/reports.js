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

getMostBorrowedBooks()
getAuthorsWithMoreBooks()
getMostReaderSection()
getMostPopularThemes()

function getMostBorrowedBooks() {
    const list = document.querySelector("#most_borrowed_books_list")
    list.innerHTML = ''
    window.reportsAPI.getMostBorrowedBooks((books) => {
        for (const book of books) {
            list.innerHTML += `
            <li>
                <p>${book.title} #${book.id}</p>
                <p>${book.author}</p>
                <p>${book.n_borrowed} veces prestado</p>
            </li>`
        }
    })
}

function getAuthorsWithMoreBooks() {
    const list = document.querySelector("#authors_with_more_books_list")
    list.innerHTML = ''
    window.reportsAPI.getAuthorsWithMoreBooks((authors) => {
        for (const author of authors) {
            list.innerHTML += `
            <li>
                <p>${author.author}</p>
                <p>${author.n_books} libros</p>
            </li>`
        }
    })
}

function getMostReaderSection() {
    const list = document.querySelector("#most_readers_courses_list")
    list.innerHTML = ''
    window.reportsAPI.getMostReaderSection((reports) => {
        for (const report of reports) {
            list.innerHTML += `
            <li>
                <p>${report.grade} "${report.section}"</p>
                <p>Sacó ${report.n_borrowed} libros</p>
            </li>`
        }
    })
}

function getMostPopularThemes() {
    const list = document.querySelector("#most_popular_themes_list")
    list.innerHTML = ''
    window.reportsAPI.getMostPopularThemes((reports) => {
        for (const report of reports) {
            list.innerHTML += `
            <li>
                <p>${report.theme}</p>
                <p>${report.n_borrowed} veces prestado</p>
            </li>`
        }
    })
}