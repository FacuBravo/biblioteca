let loanInfo = null
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
    if (token != null) {
        getData()
    } else {
        loanInfo = null
        printInfo()
    }
}

function getData() {
    window.loansAPI.getLoanData((loanData) => {
        loanInfo = loanData
        printInfo()
    }, token)
}

function printInfo() {
    document.querySelector("#test").innerHTML = ''
    
    if (loanInfo == null) {
        return
    }

    if (loanInfo.book.id) {
        document.querySelector("#test").innerHTML += loanInfo.book.title
    }

    if (loanInfo.user.id) {
        document.querySelector("#test").innerHTML += loanInfo.user.name
    }
}