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
    login: async (callback, username, pass) => {
        let user = (await ipcRenderer.invoke('get-user'))[0]
        
        if (user.username == username) {
            bcrypt.compare(pass, user.password, (err, result) => {
                if (result) {
                    callback(true)
                } else {
                    callback(false)
                }
            })
        } else {
            callback(false)
        }
    }
})