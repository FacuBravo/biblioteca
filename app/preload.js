const { contextBridge, ipcRenderer } = require('electron')
const bcrypt = require('bcryptjs')

contextBridge.exposeInMainWorld('electronAPI', {
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
    },
    addBook: async (callback, bookInfo) => {
        let book = await ipcRenderer.invoke('add-book', bookInfo)
        callback(book)
    },
    getBooks: async (callback) => {
        let books = await ipcRenderer.invoke('get-books')
        callback(books)
    }
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