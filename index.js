const express = require("express")
const hbs = require("hbs")
const session = require('express-session')

require("dotenv").config()

const Router = require("./routes/index")

const app = express()

var sess = {
    secret: process.env.SESSION_SECRET_KEY,
    cookie: {}
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess))


require("./db_connect")
require("./helpers")

app.set("view engine", "hbs")
app.use(express.static("./views/static"))  //use to serve static files like css,js,images, etc
app.use("/public", express.static("public"))
hbs.registerPartials("./views/partials")

app.use("/", Router)

let port = process.env.PORT || 8000
app.listen(port, () => console.log(`Server is Running at http://localhost:${port}`))




/*
npm init -y
npm i express
npm i hbs
npm i mongoose
npm i body-parser //middleware form-data
npm i -g nodemon
nodemon index.js -e hbs,js  //run both hbs,js  
npm i dotenv

npm i multer // middleware //multer is node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum effiency. (note: multer will not process any form which is not multipart(multipart/form-data))

npm i password-validator
npm i bcrypt
npm i express-session
npm i nodemailer //mail otp
*/ 