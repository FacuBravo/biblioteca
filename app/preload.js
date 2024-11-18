const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateTheme: (callback) => ipcRenderer.on('theme', callback),
    getUsers: async (callback) => {
        let users = await ipcRenderer.invoke('get-users')
        callback(users)
    }
})