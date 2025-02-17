const fs = require("fs")

const Testimonial = require("../../models/Testimonial")

async function homeTestimonial(req, res) {
    try {
        let data = await Testimonial.find().sort({ _id: -1 })
        res.render("admin/testimonial/index", {
            title: "Admin - Testimonial",
            data: data
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/testimonial")
    }
}

function createTestimonial(req, res) {
    res.render("admin/testimonial/create", {
        title: "Admin - Create Testimonial",
        errorMessage: {},
        data: {},
    })
}

async function storeTestimonial(req, res) {
    try {
        var data = new Testimonial(req.body)
        if (req.file) {
            data.pic = req.file.path
        }
        await data.save()
        res.redirect("/admin/testimonial")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path) //used to delete unnessary images
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.profession ? errorMessage.profession = error.errors.profession.message : null
        error.errors?.message ? errorMessage.message = error.errors.message.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/testimonial/create", {
            title: "Admin - Create Testimonial",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editTestimonial(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/testimonial/edit", {
                title: "Admin - Update Testimonial",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/testimonial")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/testimonial")
    }
}

async function updateTestimonial(req, res) {
    try {
        var data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.profession = req.body.profession
            data.message = req.body.message
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
        res.redirect("/admin/testimonial")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.profession ? errorMessage.profession = error.errors.profession.message : null
        error.errors?.message ? errorMessage.message = error.errors.message.message : null
        error.errors?.pic ? errorMessage.pic = error.errors.pic.message : null

        res.render("admin/testimonial/edit", {
            title: "Admin - Update Testimonial",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteTestimonial(req, res) {
    try {
        let data = await Testimonial.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.pic)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/testimonial")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/testimonial")
    }
}


module.exports = {
    homeTestimonial: homeTestimonial,
    createTestimonial: createTestimonial,
    storeTestimonial: storeTestimonial,
    editTestimonial: editTestimonial,
    updateTestimonial: updateTestimonial,
    deleteTestimonial: deleteTestimonial
}