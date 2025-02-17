const mongoose = require("mongoose")

const BlogSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name Field Is Mendatory"]
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
}, { timestamps: true })
const Blog = new mongoose.model("Blog", BlogSchema)

module.exports = Blog