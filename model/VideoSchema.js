const mongoose = require("mongoose");
const videoSchema = new mongoose.Schema({
    link: String,
    title:String,
    uploadedOn:String,
    thumbnail:String,
    subscriberCount: String,
    likes: String,
    comments: String,
    views: String,
    earnings: String,
});
const Video = mongoose.model("Video", videoSchema);
module.exports = Video;
