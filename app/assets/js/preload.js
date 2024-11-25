const { contextBridge, ipcRenderer } = require('electron')
const bcrypt = require('bcryptjs')

contextBridge.exposeInMainWorld('data', {
    getUsersN: async (callback) => {
        let users = await ipcRenderer.invoke('get-partners-n')
        callback(users[0].n)
    },
    getBooksN: async (callback) => {
        let books = await ipcRenderer.invoke('get-books-n')
        callback(books[0].n)
    },
    getLoansN: async (callback) => {
        let loans = await ipcRenderer.invoke('get-loans-n')
        callback(loans[0].n)
    }
})

contextBridge.exposeInMainWorld('booksAPI', {
    addBook: async (callback, bookInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let id = await ipcRenderer.invoke('get-next-book-id')
            bookInfo.id = id
            let book = await ipcRenderer.invoke('add-book', bookInfo)
            callback(book)
        } else {
            callback(null)
        }
    },
    updateBook: async (callback, bookInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let res = await ipcRenderer.invoke('update-book', bookInfo)
            if (res) {
                callback(true)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    },
    getBooks: async (callback) => {
        let books = await ipcRenderer.invoke('get-books')
        callback(books)
    },
    deleteBook: async (callback, id, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let book = await ipcRenderer.invoke('get-book', id)
            if (book) {
                await ipcRenderer.invoke('delete-book', id)
                callback(book)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    },
    updateBookState: async (callback, id, borrowed, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            await ipcRenderer.invoke('set-book-state', id, borrowed)
            callback(true)
        } else {
            callback(null)
        }
    }
})

contextBridge.exposeInMainWorld('usersAPI', {
    addUser: async (callback, userInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let id = await ipcRenderer.invoke('get-next-partner-id')
            userInfo.id = id
            let user = await ipcRenderer.invoke('add-partner', userInfo)
            callback(user)
        } else {
            callback(null)
        }
    },
    updateUser: async (callback, userInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let res = await ipcRenderer.invoke('update-partner', userInfo)
            if (res) {
                callback(true)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    },
    getUsers: async (callback) => {
        let users = await ipcRenderer.invoke('get-partners')
        callback(users)
    },
    deleteUser: async (callback, id, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let user = await ipcRenderer.invoke('get-partner', id)
            if (user) {
                await ipcRenderer.invoke('delete-partner', id)
                callback(user)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    }
})

contextBridge.exposeInMainWorld('authorsAPI', {
    getAuthors: async (callback) => {
        let authors = await ipcRenderer.invoke('get-authors')
        callback(authors)
    }
})

contextBridge.exposeInMainWorld('loansAPI', {
    addLoan: async (callback, loanInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let loan = await ipcRenderer.invoke('add-loan', loanInfo)
            callback(loan)
        } else {
            callback(null)
        }
    },
    updateLoan: async (callback, loanInfo, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let res = await ipcRenderer.invoke('update-loan', loanInfo)
            if (res) {
                callback(true)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    },
    getLoans: async (callback) => {
        let loans = await ipcRenderer.invoke('get-loans')
        callback(loans)
    },
    updateLoanState: async (callback, id, returned, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            await ipcRenderer.invoke('set-loan-state', id, returned)
            callback(true)
        } else {
            callback(null)
        }
    },
    deleteLoan: async (callback, id, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            let loan = await ipcRenderer.invoke('get-loan', id)
            if (loan) {
                await ipcRenderer.invoke('delete-loan', id)
                callback(loan)
            } else {
                callback(null)
            }
        } else {
            callback(null)
        }
    },
    getLoanData: async (callback) => {
        callback(await ipcRenderer.invoke('get-loan-data'))
    },
    setBookForLoan: async (callback, book, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            ipcRenderer.send('set-book-loan', book)
            callback(true)
        }
    },
    setUserForLoan: async (callback, user, token) => {
        let result = await ipcRenderer.invoke('check-session', token)
        if (result) {
            ipcRenderer.send('set-user-loan', user)
            callback(true)
        }
    },
    clearBookForLoan: () => ipcRenderer.send('clear-book-loan'),
    clearUserForLoan: () => ipcRenderer.send('clear-user-loan')
})

contextBridge.exposeInMainWorld('session', {
    setSession: async (callback, data) => {
        let user = (await ipcRenderer.invoke('get-user'))[0]
        
        if (user.username == data.username) {
            bcrypt.compare(data.pass, user.password, (err, result) => {
                if (result) {
                    const token = getToken()
                    ipcRenderer.send('set-session', { username: data.username, token })
                    callback(token)
                } else {
                    callback(null)
                }
            })
        } else {
            callback(null)
        }
    },
    getSession: () => ipcRenderer.invoke('get-session'),
    clearSession: () => ipcRenderer.send('clear-session')
})

function getToken(longitud = 32) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''

    for (let i = 0; i < longitud; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length)
        token += caracteres[indiceAleatorio]
    }

    return token
}