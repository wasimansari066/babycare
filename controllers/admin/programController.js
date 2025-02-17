const fs = require("fs")
const mailer = require("../../mailer/index")
const Newsletter = require("../../models/Newsletter")

const Program = require("../../models/Program")

async function homeProgram(req, res) {
    try {
        let data = await Program.find().sort({ _id: -1 })
        res.render("admin/program/index", {
            title: "Admin - Program",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/program")
    }
}

function createProgram(req, res) {
    res.render("admin/program/create", {
        title: "Admin - Create Program",
        errorMessage: {},
        data: {
            seats: 50,
            duration: 60,
            sortOrder: 10,
            session: req.session,
        }
    })
}

async function storeProgram(req, res) {
    try {
        var data = new Program(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        const newsletters = await Newsletter.find()
        newsletters.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `Checkout Our New Program : Team ${process.env.SITE_NAME}`,
                text: `
                    Hello Guardians,
                    Please Checkout Our Latest Program
                    Click on The Link Below
                    ${process.env.SERVER}/program/${data._id}
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
        })
        await data.save()
        res.redirect("/admin/program")
    } catch (error) {
        console.log(error)
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.fee ? errorMessage.fee = error.errors.fee.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null

        res.render("admin/program/create", {
            title: "Admin - Create Program",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editProgram(req, res) {
    try {
        let data = await Program.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/program/edit", {
                title: "Admin - Update Program",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/program")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/program")
    }
}

async function updateProgram(req, res) {
    try {
        var data = await Program.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.fee = req.body.fee
            data.seats = req.body.seats
            data.duration = req.body.duration
            data.shortDescription = req.body.shortDescription
            data.longDescription = req.body.longDescription
            data.metaTitle = req.body.metaTitle
            data.metaDescription = req.body.metaDescription
            data.metaKeywords = req.body.metaKeywords
            data.active = req.body.active
            data.sortOrder = req.body.sortOrder
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.cover)
                } catch (error) { }
                data.cover = req.file.path
            }
            const newsletters = await Newsletter.find()
            newsletters.forEach(x => {
                mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: x.email,
                    subject: `There is Some Update Regaring Our New Program : Team ${process.env.SITE_NAME}`,
                    text: `
                    Hello Guardians,
                    Please There is Some Update Regaring Our Latest Program
                    Click on The Link Below to Know More
                    ${process.env.SERVER}/program/${data._id}
                `
                }, (error) => {
                    if (error)
                        console.log(error)
                })
            })
            await data.save()
        }
        res.redirect("/admin/program")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.fee ? errorMessage.fee = error.errors.fee.message : null

        res.render("admin/program/edit", {
            title: "Admin - Update Program",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteProgram(req, res) {
    try {
        let data = await Program.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/program")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/program")
    }
}

async function showProgram(req, res) {
    try {
        let data = await Program.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/program/show", {
                title: `Admin - Program "${data.name}"`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/program")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/program")
    }
}

module.exports = {
    homeProgram: homeProgram,
    createProgram: createProgram,
    storeProgram: storeProgram,
    editProgram: editProgram,
    updateProgram: updateProgram,
    deleteProgram: deleteProgram,
    showProgram: showProgram
}