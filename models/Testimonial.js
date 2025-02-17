const mongoose = require("mongoose")

const TestimonialSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mendatory"]
    },
    profession: {
        type: String,
        required: [true, "Profession Field Is Mendatory"]
    },
    message: {
        type: String,
        required: [true, "Message Field Is Mendatory"]
    },
    pic: {
        type: String,
        required: [true, "Pic Field Is Mendatory"]
    },
    sortOrder: {
        type: Number,
        default: 10
    },
    active: {
        type: Boolean,
        default: true
    }
})

const Testimonial = new mongoose.model("Testimonial", TestimonialSchema)

module.exports = Testimonial