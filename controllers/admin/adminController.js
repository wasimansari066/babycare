const User = require("../../models/User")
async function home(req, res) {
    let data = await User.findOne({ _id: req.session.userid })
    res.render("admin/home", {
        title: "Admin",
        data: data,
        session: req.session,
    })
}


module.exports = {
    home: home,
}