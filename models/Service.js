const mongoose = require("mongoose")

const ServiceSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mendatory"]
    },
    icon: {
        type: String,
        required: [true, "Icon Field Is Mendatory"]
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
const Service = new mongoose.model("Service", ServiceSchema)

module.exports = Service