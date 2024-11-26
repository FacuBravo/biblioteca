const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

let db

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "app/assets/images/icons/icon.ico",
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'app/assets/js/preload.js')
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

            db.run("PRAGMA foreign_keys = ON", [], (err) => {
                if (err) {
                    console.error('Error al activar fk:', err.message)
                } else {
                    console.log('Fk activadas')
                }
            })
            
            createTables()
        }
    })

    createWindow()
})

// DATA

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

// PARTNERS

ipcMain.handle('get-next-partner-id', async () => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id + 1 AS newId 
        FROM partner 
        WHERE (id + 1) NOT IN (SELECT id FROM partner) 
        ORDER BY id 
        LIMIT 1`, [], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row ? row.newId : 1)
            }
        })
    })
})

ipcMain.handle('add-partner', async (event, partnerInfo) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO partner (id, name, surname, grade, section, type) VALUES (?, ?, ?, ?, ?, ?)',
            [partnerInfo.id, partnerInfo.name, partnerInfo.surname, partnerInfo.grade, partnerInfo.section, partnerInfo.type], function (err) {

                if (err) {
                    reject(err)
                } else {
                    db.get('SELECT * FROM partner WHERE id = ?', [partnerInfo.id], (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row)
                        }
                    })
                }
            })
    })
})

ipcMain.handle('update-partner', async (event, partnerInfo) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE partner SET name = ?, surname = ?, grade = ?, section = ?, type = ? WHERE id = ?',
            [partnerInfo.name, partnerInfo.surname, partnerInfo.grade, partnerInfo.section, partnerInfo.type, partnerInfo.id], function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
    })
})

ipcMain.handle('get-partners', async () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT p.*, 
            (SELECT 1 FROM loan l WHERE l.partner_id = p.id AND l.returned = 0) as active_loans, 
            (SELECT 1 FROM loan l WHERE l.partner_id = p.id AND l.date_end < DATE('now') AND l.returned = 0) as state 
            FROM partner p ORDER BY p.id`, [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-partner', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM partner WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
})

ipcMain.handle('delete-partner', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.all('DELETE FROM partner WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

// BOOKS

ipcMain.handle('get-next-book-id', async () => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT id + 1 AS newId 
        FROM book 
        WHERE (id + 1) NOT IN (SELECT id FROM book) 
        ORDER BY id 
        LIMIT 1`, [], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row ? row.newId : 1)
            }
        })
    })
})

ipcMain.handle('add-book', async (event, bookInfo) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO book (id, title, author, edition, place, editorial, year, theme, borrowed, collection) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?)',
            [bookInfo.id, bookInfo.title, bookInfo.author, bookInfo.edition, bookInfo.place, bookInfo.editorial, bookInfo.year, bookInfo.theme, bookInfo.collection], function (err) {

                if (err) {
                    reject(err)
                } else {
                    db.get('SELECT * FROM book WHERE id = ?', [bookInfo.id], (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row)
                        }
                    })
                }
            })
    })
})

ipcMain.handle('set-book-state', async (event, id, borrowed) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE book SET borrowed = ? WHERE id = ?', [borrowed, id], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
})

ipcMain.handle('update-book', async (event, bookInfo) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE book SET title = ?, author = ?, edition = ?, place = ?, editorial = ?, year = ?, theme = ?, collection = ? WHERE id = ?',
            [bookInfo.title, bookInfo.author, bookInfo.edition, bookInfo.place, bookInfo.editorial, bookInfo.year, bookInfo.theme, bookInfo.collection, bookInfo.id], function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
    })
})

ipcMain.handle('get-books', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM book b ORDER BY b.id', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-book', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM book b WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
})

ipcMain.handle('delete-book', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.all('DELETE FROM book WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

// LOANS

ipcMain.handle('add-loan', async (event, loanInfo) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO loan (date_start, date_end, returned, book_id, partner_id) VALUES (?, ?, 0, ?, ?)',
            [loanInfo.date_start, loanInfo.date_end, loanInfo.book_id, loanInfo.partner_id], function (err) {

                if (err) {
                    reject(err)
                } else {
                    db.get('SELECT * FROM loan WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(row)
                        }
                    })
                }
            })
    })
})

ipcMain.handle('set-loan-state', async (event, id, returned) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE loan SET returned = ? WHERE id = ?', [returned, id], function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(true)
            }
        })
    })
})

ipcMain.handle('update-loan', async (event, loanInfo) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE laon SET date_start = ?, date_end = ?, book_id = ?, partner_id = ? WHERE id = ?',
            [loanInfo.date_start, loanInfo.date_end, loanInfo.book_id, loanInfo.partner_id, loanInfo.id], function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
    })
})

ipcMain.handle('get-loans', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT l.id, l.date_start, l.date_end, l.book_id, l.partner_id, l.returned, p.name, b.title, b.borrowed FROM loan l JOIN partner p ON l.partner_id = p.id JOIN book b ON b.id = l.book_id', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-loan', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM loan WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
})

ipcMain.handle('delete-loan', async (event, id) => {
    return new Promise((resolve, reject) => {
        db.all('DELETE FROM loan WHERE id = ?', [id], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

const bookForLoan = {}, userForLoan = {}

ipcMain.on('set-book-loan', (event, book) => {
    Object.assign(bookForLoan, book)
})

ipcMain.on('set-user-loan', (event, user) => {
    Object.assign(userForLoan, user)
})

ipcMain.handle('get-loan-data', () => {
    return {
        book: bookForLoan ?? null,
        user: userForLoan ?? null
    }
})

ipcMain.on('clear-book-loan', () => {
    Object.keys(bookForLoan).forEach(key => delete bookForLoan[key])
})

ipcMain.on('clear-user-loan', () => {
    Object.keys(userForLoan).forEach(key => delete userForLoan[key])
})

// REPORTS

ipcMain.handle('get-authors-with-more-books', async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT b.author, COUNT(*) n_books FROM book b GROUP BY b.author ORDER BY n_books DESC LIMIT 3', [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-most-borrowed-books', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT b.id, b.title, b.author, COUNT(l.id) n_borrowed FROM book b JOIN loan l ON l.book_id = b.id GROUP BY b.id ORDER BY n_borrowed DESC LIMIT 3", [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-most-popular-themes', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT b.theme, COUNT(l.id) n_borrowed FROM book b JOIN loan l ON l.book_id = b.id GROUP BY b.theme ORDER BY n_borrowed DESC LIMIT 3", [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

ipcMain.handle('get-most-reader-section', async () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT p.grade, p.section, COUNT(l.id) n_borrowed FROM partner p JOIN loan l ON l.partner_id = p.id GROUP BY p.grade, p.section ORDER BY n_borrowed DESC LIMIT 3", [], (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
})

// SESSION

const sessionData = {}

ipcMain.on('set-session', (event, data) => {
    Object.assign(sessionData, data)
})

ipcMain.handle('get-session', () => {
    return sessionData
})

ipcMain.handle('check-session', (event, token) => {
    if (!sessionData.token) {
        return false
    }
    return token == sessionData.token
})

ipcMain.on('clear-session', () => {
    Object.keys(sessionData).forEach(key => delete sessionData[key])
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

function addAuthorizedUser() {
    db.all('SELECT COUNT(*) n FROM user', [], (err, rows) => {
        if (err) {
            console.error(err)
        } else {
            if (rows[0].n == 0) {
                db.run(`INSERT INTO user (username, password) VALUES ("biblio56", "$2a$10$tjwsS.FB0pUXX/1vh6QQ6OajbAXhX7PWCS7h2A8iqMrFSQGstnGOy")`, (err) => {
                    if (err) {
                        console.error('Error al insertar usuario autorizado:', err.message)
                    } else {
                        console.log('Usuario autorizado agregado')
                    }
                })
            }
        }
    })
}

// OTHERS

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
            console.log('Tabla user iniciada')
            addAuthorizedUser()
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
            console.log('Tabla partner iniciada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY, 
            title varchar(150), 
            author varchar(400), 
            edition varchar(100) NULL, 
            place varchar(100) NULL, 
            editorial varchar(100) NULL, 
            year INTEGER NULL,
            borrowed INTEGER,
            theme varchar(100),
            collection varchar(80) NULL)`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla book iniciada')
        }
    })

    db.run(`CREATE TABLE IF NOT EXISTS loan (
            id INTEGER PRIMARY KEY, 
            date_start DATE, 
            date_end DATE, 
            returned INTEGER,
            book_id INTEGER, 
            partner_id INTEGER,
            FOREIGN KEY (book_id) REFERENCES book (id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
            FOREIGN KEY (partner_id) REFERENCES partner (id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE)`, (err) => {
        if (err) {
            console.error('Error al crear la tabla:', err.message)
        } else {
            console.log('Tabla loan iniciada')
        }
    })
}