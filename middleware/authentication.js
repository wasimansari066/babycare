function isLogin(req, res, next) {
    if (req.session.login)
        next()
    else
        res.redirect("/admin/user/login")
}
function isSuperAdmin(req, res, next) {
    if (req.session.login && req.session.role === "Super Admin")
        next()
    else if (req.session.login)
        res.redirect("/admin")
    else
        res.redirect("/admin/user/login")
}

module.exports = {
    isLogin: isLogin,
    isSuperAdmin: isSuperAdmin
}