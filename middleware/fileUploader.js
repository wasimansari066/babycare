const multer = require("multer")

function createUploader(folder) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/uploads/${folder}`)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + file.originalname)
        }
    })

    return multer({ storage: storage })
}

module.exports = {
    testimonialsUploader: createUploader("testimonials"),
    servicesUploader: createUploader("services"),
    programsUploader: createUploader("programs"),
    eventsUploader: createUploader("events"),
    teamsUploader: createUploader("teams"),
    blogsUploader: createUploader("blogs")
}