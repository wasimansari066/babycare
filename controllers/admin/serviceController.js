const fs = require("fs")
const mailer = require("../../mailer/index")
const Newsletter = require("../../models/Newsletter")
const Service = require("../../models/Service")

async function homeService(req, res) {
    try {
        let data = await Service.find().sort({ _id: -1 })
        res.render("admin/service/index", {
            title: "Admin - Service",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

function createService(req, res) {
    res.render("admin/service/create", {
        title: "Admin - Create Service",
        errorMessage: {},
        data: { sortOrder: 10 },
        session: req.session,
    })
}

async function storeService(req, res) {
    try {
        var data = new Service(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        await data.save()
        const newsletters = await Newsletter.find()
        newsletters.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `Checkout Our New Service : Team ${process.env.SITE_NAME}`,
                text: `
                    Hello Guardians,
                    Please Checkout Our Latest Service
                    Click on The Link Below
                    ${process.env.SERVER}/service/${data._id}
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
        })
        res.redirect("/admin/service")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.icon ? errorMessage.icon = error.errors.icon.message : null

        res.render("admin/service/create", {
            title: "Admin - Create Service",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editService(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/edit", {
                title: "Admin - Update Service",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/service")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function updateService(req, res) {
    try {
        var data = await Service.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.icon = req.body.icon
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
            await data.save()
            const newsletters = await Newsletter.find()
            newsletters.forEach(x => {
                mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: x.email,
                    subject: `There is Some Update Regaring Our New Service : Team ${process.env.SITE_NAME}`,
                    text: `
                    Hello Guardians,
                    Please There is Some Update Regaring Our Latest Service
                    Click on The Link Below to Know More
                    ${process.env.SERVER}/service/${data._id}
                `
                }, (error) => {
                    if (error)
                        console.log(error)
                })
            })
        }
        res.redirect("/admin/service")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.icon ? errorMessage.icon = error.errors.icon.message : null

        res.render("admin/service/edit", {
            title: "Admin - Update Service",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteService(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

async function showService(req, res) {
    try {
        let data = await Service.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/service/show", {
                title: `Admin - Service "${data.name}"`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/service")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/service")
    }
}

module.exports = {
    homeService: homeService,
    createService: createService,
    storeService: storeService,
    editService: editService,
    updateService: updateService,
    deleteService: deleteService,
    showService: showService
}