const express = require("express");
const router = express.Router();
const Video = require("../model/VideoSchema");
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const youtube = google.youtube({
    version: 'v3',
    auth: 'AIzaSyDIwsGc9v6ngdfVyKpIETcXp8BZLxVVmHs',
});

const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: 'vstask69@gmail.com',
        pass: 'ozxo rnyj ywao ipgq',
    },
});
function extractVideoId(url) {
    const match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

function calculateEarnings(subscriberCount, views, likes, comments) {
    return Math.min(subscriberCount, views) + 10 * comments + 5 * likes;
}


router.post('/analyze', async (req, res) => {
    try {

        const videoId = extractVideoId(req.body.link);
        const response = await youtube.videos.list({
            part: 'snippet,statistics,contentDetails',
            id: videoId,
        });

        const videoData = response.data.items[0];

        const { viewCount: views, likeCount: likes, commentCount: comments } = videoData.statistics;
        const { publishedAt, title, thumbnails } = videoData.snippet;
        const url = thumbnails.default.url;
        const { channelId } = videoData.snippet;
        console.log(channelId);


        const subscriptionResponse = await youtube.channels.list({
            part: 'statistics',
            id: channelId,
            maxResults: 10,
        });

        const subscriberCount = subscriptionResponse.data.items[0]?.statistics?.subscriberCount;
        console.log(subscriberCount);

        const video = new Video({
            link: req.body.link,
            title,
            thumbnail: url,
            uploadedOn: publishedAt,
            subscriberCount,
            likes,
            comments,
            views,

        });
        await video.save();

        res.json({ message: 'Video analysis completed successfully', data: video });
    } catch (error) {
        console.error('Error analyzing video:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/Api/get-video', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/request-callback', async (req, res) => {

    const { name, email, phone } = req.body;

    // Send email notification
    const mailOptions = {
        from: 'vstask69@gmail.com',
        to: 'ravi@anchors.in',
        subject: 'Callback Request',
        text: `Name: ${name}\nPhone: ${phone}\n`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Callback request submitted successfully' });
        }
    });
});

module.exports = router;