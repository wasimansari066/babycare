const fs = require("fs")

const Team = require("../../models/Team")

async function homeTeam(req, res) {
    try {
        let data = await Team.find().sort({ _id: -1 })
        res.render("admin/team/index", {
            title: "Admin - Team",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/team")
    }
}

function createTeam(req, res) {
    res.render("admin/team/create", {
        title: "Admin - Create Team",
        errorMessage: {},
        data: { sortOrder: 10 },
        session: req.session,
    })
}

async function storeTeam(req, res) {
    try {
        var data = new Team(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/team")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.profile ? errorMessage.profile = error.errors.profile.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/team/create", {
            title: "Admin - Create Team",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editTeam(req, res) {
    try {
        let data = await Team.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/team/edit", {
                title: "Admin - Update Team",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/team")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/team")
    }
}

async function updateTeam(req, res) {
    try {
        var data = await Team.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.profile = req.body.profile
            data.facebook = req.body.facebook
            data.linkedin = req.body.linkedin
            data.twitter = req.body.twitter
            data.instagram = req.body.instagram
            data.active = req.body.active
            data.sortOrder = req.body.sortOrder
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
            }
            await data.save()
        }
        res.redirect("/admin/team")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.profile ? errorMessage.profile = error.errors.profile.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/team/edit", {
            title: "Admin - Update Team",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteTeam(req, res) {
    try {
        let data = await Team.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/team")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/team")
    }
}

module.exports = {
    homeTeam: homeTeam,
    createTeam: createTeam,
    storeTeam: storeTeam,
    editTeam: editTeam,
    updateTeam: updateTeam,
    deleteTeam: deleteTeam
}