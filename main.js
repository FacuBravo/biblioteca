const { app, BrowserWindow, ipcMain,Menu } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

let db

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'app/preload.js')
        }
    })

    mainWindow.loadFile('app/home.html')
    Menu.setApplicationMenu(null)
}

app.whenReady().then(() => {
    db = new sqlite3.Database('mydb.db', (err) => {
        if (err) {
            console.error('Error al abrir la base de datos:', err.message)
        } else {
            console.log('Base de datos abierta')
            createTables()
        }
    })

    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db.close((err) => {
            if (err) {
                console.error('Error al cerrar la base de datos:', err.message)
            } else {
                console.log('Base de datos cerrada')
            }
        })
        app.quit()
    }
})

function createTables() {
    // db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)', (err) => {
    //     if (err) {
    //         console.error('Error al crear la tabla:', err.message)
    //     }
    // })
}