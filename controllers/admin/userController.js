const PasswordValidator = require('password-validator');
const bcrypt = require("bcrypt")

const User = require("../../models/User");
const mailer = require("../../mailer/index")

const schema = new PasswordValidator();

// Add properties to it
schema
    .is().min(8)                                    // Minimum length 8
    .is().max(100)                                  // Maximum length 100
    .has().uppercase(1)                             // Must have at least 1 uppercase letter
    .has().lowercase(1)                             // Must have at least 1 lowercase letter
    .has().digits(1)                                // Must have at least 1 digit
    .has().not().spaces()                           // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

async function homeUser(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 })
        res.render("admin/user/index", {
            title: "Admin - User",
            session: req.session,
            data: data
        })
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user")
    }
}

function createUser(req, res) {
    res.render("admin/user/create", {
        title: "Admin - Create User",
        errorMessage: {},
        data: {},
        session: req.session
    })
}

async function storeUser(req, res) {
    var data = new User(req.body)
    if (req.body.password === req.body.cpassword) {
        if (schema.validate(req.body.password)) {
            bcrypt.hash(req.body.password, 12, async (error, hash) => {
                if (error) {
                    // console.log(error)
                    console.log("Something Went Wrong")
                }
                else {
                    try {
                        data.password = hash
                        await data.save()
                        res.redirect("/admin/user")
                    } catch (error) {
                        console.log(req.body)
                        console.log(error)
                        let errorMessage = {}
                        error.keyValue?.username ? errorMessage.username = "Username Already Exist" : null
                        error.keyValue?.email ? errorMessage.email = "Email Address is Already Exist" : null
                        error.errors?.name ? errorMessage.name = error.errors.name.message : null
                        error.errors?.username ? errorMessage.username = error.errors.username.message : null
                        error.errors?.email ? errorMessage.email = error.errors.email.message : null
                        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null
                        error.errors?.password ? errorMessage.password = error.errors.password.message : null

                        res.render("admin/user/create", {
                            title: "Admin - Create User",
                            errorMessage: errorMessage,
                            data: data,
                            session: req.session,
                        })
                    }
                }
            })
        }
        else
            res.render("admin/user/create", {
                title: "Admin - Create User",
                errorMessage: {
                    password: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
                },
                data: data,
                session: req.session,
            })
    }
    else
        res.render("admin/user/create", {
            title: "Admin - Create User",
            errorMessage: {
                password: "Password and Confirm Password Doesn't Matched"
            },
            data: data,
            session: req.session,
        })
}

async function editUser(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            res.render("admin/user/edit", {
                title: "Admin - Update User",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin/user")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user")
    }
}

async function updateUser(req, res) {
    try {
        var data = await User.findOne({ _id: req.params._id })
        if (data) {
            data.name = req.body.name
            data.email = req.body.email
            data.username = req.body.username
            data.phone = req.body.phone
            data.role = req.body.role
            data.active = req.body.active
            await data.save()
        }
        res.redirect("/admin/user")
    } catch (error) {
        let errorMessage = {}
        error.keyValue?.username ? errorMessage.username = "Username Already Exist" : null
        error.keyValue?.email ? errorMessage.email = "Email Address is Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.username ? errorMessage.username = error.errors.username.message : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null

        res.render("admin/user/edit", {
            title: "Admin - Update User",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function updateProfile(req, res) {
    try {
        let data = await User.findOne({ _id: req.session.userid })
        if (data) {
            res.render("admin/user/update-profile", {
                title: "Admin - Update User",
                errorMessage: {},
                data: data,
                session: req.session,
            })
        }
        else {
            res.redirect("/admin")
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin")
    }
}

async function updateProfileStore(req, res) {
    try {
        var data = await User.findOne({ _id: req.session.userid })
        if (data) {
            data.name = req.body.name
            data.email = req.body.email
            data.username = req.body.username
            data.phone = req.body.phone
            await data.save()
        }
        res.redirect("/admin")
    } catch (error) {
        let errorMessage = {}
        error.keyValue?.username ? errorMessage.username = "Username Already Exist" : null
        error.keyValue?.email ? errorMessage.email = "Email Address is Already Exist" : null
        error.errors?.name ? errorMessage.name = error.errors.name.message : null
        error.errors?.username ? errorMessage.username = error.errors.username.message : null
        error.errors?.email ? errorMessage.email = error.errors.email.message : null
        error.errors?.phone ? errorMessage.phone = error.errors.phone.message : null

        res.render("admin/user/update-profile", {
            title: "Admin - Update Profile",
            errorMessage: errorMessage,
            data: data,
            session: req.session,
        })
    }
}

async function deleteUser(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id })
        if (data) {
            await data.deleteOne()
        }
        res.redirect("/admin/user")
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user")
    }
}

function loginUser(req, res) {
    res.render("admin/user/login", {
        title: "Admin - Login",
        errorMessage: "",
        session: req.session,
    })
}
async function loginUserStore(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        })
        if (data && await bcrypt.compare(req.body.password, data.password)) {
            req.session.login = true
            req.session.name = data.name
            req.session.userid = data._id
            req.session.role = data.role
            var time = 86400000  //One Day
            req.session.cookie.expires = new Date(Date.now() + time)
            req.session.cookie.maxAge = time
            res.redirect("/admin")
        }
        else {
            res.render("admin/user/login", {
                title: "Admin - Login",
                errorMessage: "Invalid Username or Passwords",
                session: req.session,
            })
        }
    } catch (error) {
        console.log(error)
        res.render("admin/user/login", {
            title: "Admin - Login",
            errorMessage: "Something Went Wrong",
            session: req.session,
        })
    }
}


async function logout(req, res) {
    req.session.destroy()
    res.redirect("/admin/user/login")
}

function forgetPassword1(req, res) {
    res.render("admin/user/forget-password1", {
        title: "Admin - Reset Password",
        errorMessage: ""
    })
}
async function forgetPassword1Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, 1))
            data.otp = otp
            await data.save()

            mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `OTP for Password Reset : Team ${process.env.SITE_NAME}`,
                text: `
                        Hello ${data.name}
                        OTP for Password is ${otp}
                        Please Never Share OTP with anyone
                        Team : ${process.env.SITE_NAME}
                    `
            }, (error) => {
                if (error)
                    console.log(error)
            })
            req.session.passwordResetUsername = data.username
            res.redirect("/admin/user/forget-password-2")
        }
        else {
            res.render("admin/user/forget-password1", {
                title: "Admin - Reset Password",
                errorMessage: "User Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user/login")
    }
}

function forgetPassword2(req, res) {
    res.render("admin/user/forget-password2", {
        title: "Admin - Reset Password",
        errorMessage: ""
    })
}
async function forgetPassword2Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.session.passwordResetUsername },
                { "email": req.session.passwordResetUsername }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.redirect("forget-password-3")
            else
                res.render("admin/user/forget-password2", {
                    title: "Admin - Reset Password",
                    errorMessage: "Invalid OTP"
                })
        }
        else {
            res.render("admin/user/forget-password2", {
                title: "Admin - Reset Password",
                errorMessage: "UnAuthrorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user/login")
    }
}

function forgetPassword3(req, res) {
    res.render("admin/user/forget-password3", {
        title: "Admin - Reset Password",
        errorMessage: ""
    })
}
async function forgetPassword3Store(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.session.passwordResetUsername },
                { "email": req.session.passwordResetUsername }
            ]
        })
        if (data) {
            if (req.body.password === req.body.cpassword) {
                if (schema.validate(req.body.password)) {
                    bcrypt.hash(req.body.password, 12, async (error, hash) => {
                        if (error) {
                            console.log(error)
                            res.redirect("/admin/user/login")
                        }
                        else {
                            data.password = hash
                            await data.save()
                            req.session.destroy()
                            res.redirect("/admin/user/login")
                        }
                    })
                }
                else
                    res.render("admin/user/forget-password3", {
                        title: "Admin - Reset Password",
                        errorMessage: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
                    })
            }
            else
                res.render("admin/user/forget-password3", {
                    title: "Admin - Reset Password",
                    errorMessage: "Password and Confrim Password Doesn't Matched"
                })
        }
        else {
            res.render("admin/user/forget-password3", {
                title: "Admin - Reset Password",
                errorMessage: "UnAuthrorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.redirect("/admin/user/login")
    }
}

module.exports = {
    homeUser: homeUser,
    createUser: createUser,
    storeUser: storeUser,
    editUser: editUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    loginUser: loginUser,
    loginUserStore: loginUserStore,
    updateProfile: updateProfile,
    updateProfileStore: updateProfileStore,
    logout: logout,
    forgetPassword1: forgetPassword1,
    forgetPassword1Store: forgetPassword1Store,
    forgetPassword2: forgetPassword2,
    forgetPassword2Store: forgetPassword2Store,
    forgetPassword3: forgetPassword3,
    forgetPassword3Store: forgetPassword3Store,
}