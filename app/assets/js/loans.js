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
    if (token == null) {
        console.log("NOT LOGGED")
    } else {
        // setData()
        // getData()
    }
}

function getData() {
    window.loansAPI.getLoanData((loanData) => {
        console.log(loanData)
    }, token)
}

function setData() {
    window.loansAPI.setUserIdForLoan(() => {
        console.log(true)
    }, { userId: 3 }, token)
}