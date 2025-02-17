const MainRouter = require("express").Router()
const encoder = require("../middleware/bodyParser")

const { home, about, service, program, event, blog, team, testimonial, contactUs, showService, showProgram, showEvent, showBlog, newsletter, newsletterConfirmation, contactUsStore } = require("../controllers/main/index")

MainRouter.get("", home)
MainRouter.get("/about", about)
MainRouter.get("/service", service)
MainRouter.get("/service/:_id", showService)
MainRouter.get("/program", program)
MainRouter.get("/program/:_id", showProgram)
MainRouter.get("/event", event)
MainRouter.get("/event/:_id", showEvent)
MainRouter.get("/blog", blog)
MainRouter.get("/blog/:_id", showBlog)
MainRouter.get("/team", team)
MainRouter.get("/testimonial", testimonial)
MainRouter.get("/contact", contactUs)
MainRouter.post("/contact",encoder, contactUsStore)
MainRouter.post("/newsletter",encoder, newsletter)
MainRouter.get("/newsletter-confirmation", newsletterConfirmation)

module.exports = MainRouter