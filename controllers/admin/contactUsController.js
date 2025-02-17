const fs = require("fs")

const ContactUs = require("../../models/ContactUs")

const mailer = require("../../mailer/index")

async function homeContactUs(req, res) {
    try {
        let data = await ContactUs.find().sort({ _id: -1 })
        res.render("admin/contactus/index", {
            title: "Admin - ContactUs",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}


async function editContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            data.active = !data.active

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Query Has Been Resolved : Team ${process.env.SITE_NAME}`,
                text: `
                    Hello Guardians,
                    Your Query Has Been Resolved,
                    If you still have some issues please contact us again
                    ${process.env.SERVER}/contact
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
            await data.save()
        }
        res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}

async function showContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/contactUs/show", {
                title: "Admin - ContactUs Query",
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}



async function deleteContactUs(req, res) {
    try {
        let data = await ContactUs.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/contactus")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/contactus")
    }
}

module.exports = {
    homeContactUs: homeContactUs,
    editContactUs: editContactUs,
    deleteContactUs: deleteContactUs,
    showContactUs: showContactUs
}