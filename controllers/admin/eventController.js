const fs = require("fs")
const mailer = require("../../mailer/index")
const Newsletter = require("../../models/Newsletter")

const Event = require("../../models/Event")

async function homeEvent(req, res) {
    try {
        let data = await Event.find().sort({ _id: -1 })
        res.render("admin/event/index", {
            title: "Admin - Event",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/event")
    }
}

function createEvent(req, res) {
    res.render("admin/event/create", {
        title: "Admin - Create Event",
        errorMessage: {},
        data: { sortOrder: 10 },
        session: req.session,
    })
}

async function storeEvent(req, res) {
    try {
        var data = new Event(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        const newsletters = await Newsletter.find()
        newsletters.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `Checkout Our New Event : Team ${process.env.SITE_NAME}`,
                text: `
                    Hello Guardians,
                    Please Checkout Our Latest Event
                    Click on The Link Below
                    ${process.env.SERVER}/event/${data._id}
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
        })
        await data.save()
        res.redirect("/admin/event")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.time ? errorMessage.time = error.errors.time.message : null
        error.errors?.date ? errorMessage.date = error.errors.date.message : null
        error.errors?.location ? errorMessage.location = error.errors.location.message : null

        res.render("admin/event/create", {
            title: "Admin - Create Event",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editEvent(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/event/edit", {
                title: "Admin - Update Event",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/event")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/event")
    }
}

async function updateEvent(req, res) {
    try {
        var data = await Event.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.time = req.body.time
            data.date = req.body.date
            data.location = req.body.location
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
                    subject: `There is Some Update Regarding Our Event : Team ${process.env.SITE_NAME}`,
                    text: `
                    Hello Guardians,
                    Please There is Some Update Regarding Ourest Event
                    Please Click on The Link Below to Know More
                    ${process.env.SERVER}/event/${data._id}
                `
                }, (error) => {
                    if (error)
                        console.log(error)
                })
            })
            await data.save()
        }
        res.redirect("/admin/event")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.time ? errorMessage.time = error.errors.time.message : null
        error.errors?.date ? errorMessage.date = error.errors.date.message : null
        error.errors?.location ? errorMessage.location = error.errors.location.message : null


        res.render("admin/event/edit", {
            title: "Admin - Update Event",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteEvent(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/event")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/event")
    }
}

async function showEvent(req, res) {
    try {
        let data = await Event.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/event/show", {
                title: `Admin - Event "${data.name}"`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/event")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/event")
    }
}

module.exports = {
    homeEvent: homeEvent,
    createEvent: createEvent,
    storeEvent: storeEvent,
    editEvent: editEvent,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent,
    showEvent: showEvent
}