const { app, BrowserWindow, ipcMain, Menu } = require('electron')
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
    // Menu.setApplicationMenu(null)
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

ipcMain.handle('get-partners-n', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT COUNT(*) n FROM partner', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-books-n', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT COUNT(*) n FROM book', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-loans-n', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT COUNT(*) n FROM loan', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-user', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM user', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
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
    db.run(`CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY, 
            username varchar(20), 
            password TEXT)`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla user creada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS partner (
            id INTEGER PRIMARY KEY, 
            name varchar(100), 
            surname varchar(100), 
            grade varchar(20), 
            section varchar(10), 
            type varchar(20))`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla partner creada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY, 
            title varchar(150), 
            edition varchar(100) NULL, 
            place varchar(100) NULL, 
            editorial varchar(100) NULL, 
            date DATE NULL,
            theme varchar(100),
            colection varchar(80) NULL)`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla book creada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS author (
            id INTEGER PRIMARY KEY, 
            name varchar(100), 
            surname varchar(100))`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla author creada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS author_book (
            id INTEGER PRIMARY KEY, 
            author_id INTEGER, 
            book_id INTEGER,
            FOREIGN KEY (book_id) REFERENCES book (id),
            FOREIGN KEY (author_id) REFERENCES author (id))`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla author_book creada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS loan (
            id INTEGER PRIMARY KEY, 
            date_start DATE, 
            date_end DATE, 
            book_id INTEGER, 
            partner_id INTEGER,
            FOREIGN KEY (book_id) REFERENCES book (id),
            FOREIGN KEY (partner_id) REFERENCES partner (id))`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla loan creada')
        }
    })
}