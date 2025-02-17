const fs = require("fs")
const mailer = require("../../mailer/index")
const Newsletter = require("../../models/Newsletter")

const Blog = require("../../models/Blog")

async function homeBlog(req, res) {
    try {
        let data = await Blog.find().sort({ _id: -1 })
        res.render("admin/blog/index", {
            title: "Admin - Blog",
            data: data,
            session: req.session,
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/blog")
    }
}

function createBlog(req, res) {
    res.render("admin/blog/create", {
        title: "Admin - Create Blog",
        errorMessage: {},
        data: { sortOrder: 10 },
        session: req.session,
    })
}

async function storeBlog(req, res) {
    try {
        var data = new Blog(req.body)
        if (req.file) {
            data.cover = req.file.path
        }
        await data.save()

        const newsletters = await Newsletter.find()
        newsletters.forEach(x => {
            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: x.email,
                subject: `Checkout Our New Blog : Team ${process.env.SITE_NAME}`,
                text: `
                    Hello Guardians,
                    Please Checkout Our Latest Pubhlished Blog
                    Click on The Link Below
                    ${process.env.SERVER}/blog/${data._id}
                `
            }, (error) => {
                if (error)
                    console.log(error)
            })
        })
        res.redirect("/admin/blog")
    } catch (error) {
        try {
            fs.unlinkSync(req.file.path)
        } catch (error) { }

        let errorMessage = {}
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.shortDescription ? errorMessage.shortDescription = error.errors.shortDescription.message : null
        error.errors?.longDescription ? errorMessage.longDescription = error.errors.longDescription.message : null
        error.errors?.cover ? errorMessage.cover = error.errors.cover.message : null
        error.errors?.date ? errorMessage.date = error.errors.date.message : null

        res.render("admin/blog/create", {
            title: "Admin - Create Blog",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function editBlog(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/blog/edit", {
                title: "Admin - Update Blog",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/blog")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/blog")
    }
}

async function updateBlog(req, res) {
    try {
        var data = await Blog.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.date = req.body.date
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
        }
        res.redirect("/admin/blog")
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


        res.render("admin/blog/edit", {
            title: "Admin - Update Blog",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteBlog(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id })
        if (data) {
            try {
                fs.unlinkSync(data.cover)
            } catch (error) { }
            await data.deleteOne()
        }
        res.redirect("/admin/blog")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/blog")
    }
}

async function showBlog(req, res) {
    try {
        let data = await Blog.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/blog/show", {
                title: `Admin - Blog "${data.name}"`,
                data: data,
                session: req.session,
            })
        }
        else
            res.redirect("/admin/blog")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/blog")
    }
}

module.exports = {
    homeBlog: homeBlog,
    createBlog: createBlog,
    storeBlog: storeBlog,
    editBlog: editBlog,
    updateBlog: updateBlog,
    deleteBlog: deleteBlog,
    showBlog: showBlog
}