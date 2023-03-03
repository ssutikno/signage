const fs = require('fs');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const videoDir = './public/videos/';

var app = express();

const videoFiles = fs.readdirSync(videoDir).filter(file => {
    return file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov');
})

// sort the video files aphabetically
videoFiles.sort();

// Create the playlist from the sorted video files
const playlist = videoFile.map(file =>{
    return file;
})


app.use(logger('dev'));
// Use the EJS template engine
app.set('view engine', 'ejs');
app.use('/videos', express.static(path.join(__dirname, 'public/videos')))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')))



app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
