function check_login() {
    if (session) {
        if (session.username) {
            return true
        }
    }
    else {
        return false
    }
}
function hi() {
    alert("hi")
}