const express = require('express')
const io = require('socket.io')(http);
const cors = require('cors')
const axios = require('axios')
var app = express()
var port = 3000
var http = require('http').createServer(app);

var clock = new Date('2021-01-01T00:00:00.00')

app.use(cors())
app.use(express.json())

app.post('/berkeley', (req, res) => {
    let allInstances = []
    getUrls().forEach(x => allInstances.push(axios.get(x + '/difference')));
    axios.all(allInstances)
        .then(responseArr => {
            // return avg
        })
        .then((avg) => {
            allInstances = []
            getUrls().forEach(x => allInstances.push(axios.post(x + '/time', { seconds: avg })))
            axios.all(allInstances).catch((err) => { throw err })
            res.sendStatus(200)
        })
        .catch((err) => {
            res.sendStatus(500)
        });
})

io.on('connection', (socket) => {
    console.log('A new user connected');
});

function getUrls(){
    // return list of urls 'http:192.168.1.100:3000' 
}

http.listen(port, () => {
    console.log('listening on *:3000');
});