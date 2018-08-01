const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors');
const app = express();
var whitelist = ['https://js-stream.herokuapp.com/','https://herokuapp.com','http://herokuapp.com'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) === -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))
app.get('/js/:id', (req,res) => {
  var files = fs.readdirSync(`./assets/${req.params.id}`);
  var filtered = files.filter(file => file.match(/\.mp3|.mp4|.mkv$/));
  res.json({files: filtered});
})

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.htm'))
})


app.get('/js/:course/:id', function(req, res) {
  const path = `assets/${req.params.course}/${req.params.id}`
  console.log(path);
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1]
      ? parseInt(parts[1], 10)
      : fileSize-1

    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
})

// middlewares

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Listening on port '+port);
})