const mongoose = require("mongoose")

const EventSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mendatory"]
    },
    date: {
        type: String,
        required: [true, "Event Date Field Is Mendatory"]
    },
    time: {
        type: String,
        required: [true, "Event Time Field Is Mendatory"]
    },
    location: {
        type: String,
        required: [true, "Event Location Field Is Mendatory"]
    },
    shortDescription: {
        type: String,
        required: [true, "Short Description Field Is Mendatory"]
    },
    longDescription: {
        type: String,
        required: [true, "Long Description Field Is Mendatory"]
    },
    cover: {
        type: String,
        required: [true, "Cover Pic Field Is Mendatory"]
    },
    sortOrder: {
        type: Number,
        default: 10
    },
    metaTitle: {
        type: String,
        default: ""
    },
    metaDescription: {
        type: String,
        default: ""
    },
    metaKeywords: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    }
})
const Event = new mongoose.model("Event", EventSchema)

module.exports = Event