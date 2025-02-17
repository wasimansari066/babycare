const mongoose = require("mongoose")

const TeamSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mendatory"]
    },
    profile: {
        type: String,
        required: [true, "Profile Field Is Mendatory"]
    },
    facebook: {
        type: String,
        default: ""
    },
    linkedin: {
        type: String,
        default: ""
    },
    twitter: {
        type: String,
        default: ""
    },
    instagram: {
        type: String,
        default: ""
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
const Team = new mongoose.model("Team", TeamSchema)

module.exports = Team