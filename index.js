const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const cors = require('cors')


const app = express();
app.use(cors())
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0:27017/videoAnalyzerDB', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));



const Video = require("./model/VideoSchema");

app.use(require("./routers/Video"));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});