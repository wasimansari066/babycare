const fs = require("fs")

const Newsletter = require("../../models/Newsletter")

async function homeNewsletter(req, res) {
    try {
        let data = await Newsletter.find().sort({ _id: -1 })
        res.render("admin/newsletter/index", {
            title: "Admin - Newsletter",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/newsletter")
    }
}


async function editNewsletter(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            data.active = !data.active
            await data.save()
        }
        res.redirect("/admin/newsletter")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/newsletter")
    }
}



async function deleteNewsletter(req, res) {
    try {
        let data = await Newsletter.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/newsletter")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/newsletter")
    }
}

module.exports = {
    homeNewsletter: homeNewsletter,
    editNewsletter: editNewsletter,
    deleteNewsletter: deleteNewsletter
}